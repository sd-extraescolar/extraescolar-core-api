import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { CreateEventoUseCase } from '../../application/use-cases/create-evento.use-case';
import { UpdateEventoUseCase } from '../../application/use-cases/update-evento.use-case';
import { GetEventoUseCase } from '../../application/use-cases/get-evento.use-case';
import { GetEventosByCohorteUseCase } from '../../application/use-cases/get-eventos-by-cohorte.use-case';
import { UpdateAttendanceUseCase } from '../../application/use-cases/update-attendance.use-case';
import { EventoService } from '../../application/services/evento.service';
import { UserTokens } from '../decorators/user-tokens.decorator';
import { 
  CreateEventoDto, 
  UpdateEventoDto, 
  EventoResponseDto, 
  AttendanceStatsDto,
  AttendanceUpdateDto
} from '../dtos';

@Controller('eventos')
export class EventoController {
  constructor(
    private readonly createEventoUseCase: CreateEventoUseCase,
    private readonly updateEventoUseCase: UpdateEventoUseCase,
    private readonly getEventoUseCase: GetEventoUseCase,
    private readonly getEventosByCohorteUseCase: GetEventosByCohorteUseCase,
    private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
    private readonly eventoService: EventoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvento(
    @Body() createEventoDto: CreateEventoDto,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<EventoResponseDto> {
    const fecha = new Date(createEventoDto.fecha);
    if (isNaN(fecha.getTime())) {
      throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
    }
    
    const evento = await this.createEventoUseCase.execute({
      cohorteId: createEventoDto.cohorteId,
      fecha: fecha,
      alumnosPresentes: createEventoDto.alumnosPresentes,
    }, tokens.accessToken, tokens.refreshToken);
    return new EventoResponseDto(evento);
  }

  @Get(':id')
  async getEvento(@Param('id') id: string): Promise<EventoResponseDto> {
    const evento = await this.getEventoUseCase.execute(id);
    return new EventoResponseDto(evento);
  }

  @Get('cohorte/:cohorteId')
  async getEventosByCohorte(@Param('cohorteId') cohorteId: string): Promise<EventoResponseDto[]> {
    const eventos = await this.getEventosByCohorteUseCase.execute(cohorteId);
    return eventos.map(evento => new EventoResponseDto(evento));
  }

  @Put(':id')
  async updateEvento(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<EventoResponseDto> {
    const updateData: any = {};
    
    if (updateEventoDto.fecha) {
      updateData.fecha = new Date(updateEventoDto.fecha);
    }
    
    if (updateEventoDto.alumnosPresentes) {
      updateData.alumnosPresentes = updateEventoDto.alumnosPresentes;
    }

    const evento = await this.updateEventoUseCase.execute(id, updateData, tokens.accessToken, tokens.refreshToken);
    return new EventoResponseDto(evento);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvento(@Param('id') id: string): Promise<void> {
    await this.eventoService.deleteEvento(id);
  }

  @Post(':id/attendance')
  async addAlumnosPresentes(
    @Param('id') eventoId: string,
    @Body() attendanceDto: AttendanceUpdateDto,
    @UserTokens() tokens: { accessToken: string; refreshToken?: string },
  ): Promise<EventoResponseDto> {
    const evento = await this.updateAttendanceUseCase.addAlumnosPresentes(eventoId, attendanceDto.alumnoIds, tokens.accessToken, tokens.refreshToken);
    return new EventoResponseDto(evento);
  }

  @Delete(':id/attendance')
  async removeAlumnosPresentes(
    @Param('id') eventoId: string,
    @Body() attendanceDto: AttendanceUpdateDto,
  ): Promise<EventoResponseDto> {
    const evento = await this.updateAttendanceUseCase.removeAlumnosPresentes(eventoId, attendanceDto.alumnoIds);
    return new EventoResponseDto(evento);
  }

  @Get(':id/attendance/stats')
  async getAttendanceStats(@Param('id') id: string): Promise<AttendanceStatsDto> {
    const stats = await this.eventoService.getAttendanceStats(id);
    return new AttendanceStatsDto(
      stats.totalAlumnos,
      stats.alumnosPresentes,
      stats.porcentajeAsistencia,
      stats.alumnosFaltantes,
    );
  }
}
