import {
  Controller,
  Get,
  Post,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CohorteService } from '@application/services';
import { SyncCohorteFromClassroomUseCase } from '@application/use-cases';
import { UserTokens } from '../decorators/user-tokens.decorator';
import { CohorteResponseDto, AlumnoResponseDto } from '../dtos';

@Controller()
export class CohorteController {
  constructor(
    private readonly cohorteService: CohorteService,
    private readonly syncCohorteFromClassroomUseCase: SyncCohorteFromClassroomUseCase,
  ) {}

  @Get('cohortes')
  async getAllCohortes(
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<any[]> {
    try {
      const courses = await this.cohorteService.getAllCohortesFromClassroom(tokens.accessToken, tokens.refreshToken);
      return courses;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cohorte/:cohorteId')
  async getCohorte(
    @Param('cohorteId') cohorteId: string,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<CohorteResponseDto> {
    try {
      const cohorte = await this.cohorteService.getCohorteById(cohorteId, tokens.accessToken, tokens.refreshToken);
      if (!cohorte) {
        throw new HttpException('Cohorte not found', HttpStatus.NOT_FOUND);
      }
      return new CohorteResponseDto(cohorte);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('alumno/:alumnoId/cohorte/:cohorteId')
  async getAlumnoByCohorte(
    @Param('alumnoId') alumnoId: string,
    @Param('cohorteId') cohorteId: string,
  ): Promise<AlumnoResponseDto> {
    try {
      const alumno = await this.cohorteService.getAlumnoByCohorte(alumnoId, cohorteId);
      if (!alumno) {
        throw new HttpException('Alumno not found in this cohorte', HttpStatus.NOT_FOUND);
      }
      return new AlumnoResponseDto(alumno);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cohorte/:courseId/students')
  async getCohorteStudents(
    @Param('courseId') courseId: string,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<any[]> {
    try {
      const students = await this.cohorteService.getCohorteStudentsFromClassroom(courseId, tokens.accessToken, tokens.refreshToken);
      return students;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('cohorte/:courseId/sync')
  async syncCohorteFromClassroom(
    @Param('courseId') courseId: string,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<CohorteResponseDto> {
    try {
      const cohorte = await this.syncCohorteFromClassroomUseCase.execute(courseId, tokens.accessToken, tokens.refreshToken);
      if (!cohorte) {
        throw new HttpException('Course not found in Google Classroom', HttpStatus.NOT_FOUND);
      }
      return new CohorteResponseDto(cohorte);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
