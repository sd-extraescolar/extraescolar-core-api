import { Injectable } from '@nestjs/common';
import { EventoService, CreateEventoDto } from '../services/evento.service';
import { Evento } from '../../domain/entities/evento.entity';

@Injectable()
export class CreateEventoUseCase {
  constructor(private readonly eventoService: EventoService) {}

  async execute(createEventoDto: CreateEventoDto, accessToken: string, refreshToken?: string): Promise<Evento> {
    return await this.eventoService.createEvento(createEventoDto, accessToken, refreshToken);
  }
}
