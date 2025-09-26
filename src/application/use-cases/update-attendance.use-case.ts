import { Injectable } from '@nestjs/common';
import { EventoService } from '../services/evento.service';
import { Evento } from '../../domain/entities/evento.entity';

@Injectable()
export class UpdateAttendanceUseCase {
  constructor(private readonly eventoService: EventoService) {}

  async addAlumnoPresente(eventoId: string, alumnoId: string, accessToken: string, refreshToken?: string): Promise<Evento> {
    return await this.eventoService.addAlumnoPresente(eventoId, alumnoId, accessToken, refreshToken);
  }

  async removeAlumnoPresente(eventoId: string, alumnoId: string): Promise<Evento> {
    return await this.eventoService.removeAlumnoPresente(eventoId, alumnoId);
  }

  async addAlumnosPresentes(eventoId: string, alumnoIds: string[], accessToken: string, refreshToken?: string): Promise<Evento> {
    return await this.eventoService.addAlumnosPresentes(eventoId, alumnoIds, accessToken, refreshToken);
  }

  async removeAlumnosPresentes(eventoId: string, alumnoIds: string[]): Promise<Evento> {
    return await this.eventoService.removeAlumnosPresentes(eventoId, alumnoIds);
  }
}
