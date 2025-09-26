import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CohorteService } from '@application/services';
import { CohorteResponseDto, AlumnoResponseDto } from '../dtos';

@Controller()
export class CohorteController {
  constructor(private readonly cohorteService: CohorteService) {}

  @Get('cohorte/:cohorteId')
  async getCohorte(@Param('cohorteId') cohorteId: string): Promise<CohorteResponseDto> {
    try {
      const cohorte = await this.cohorteService.getCohorteById(cohorteId);
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
}
