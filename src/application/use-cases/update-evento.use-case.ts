import { Injectable } from '@nestjs/common';
import { EventoService, UpdateEventoDto } from '../services/evento.service';
import { Evento } from '../../domain/entities/evento.entity';

@Injectable()
export class UpdateEventoUseCase {
  constructor(private readonly eventoService: EventoService) {}

  async execute(id: string, updateEventoDto: UpdateEventoDto, accessToken: string, refreshToken?: string): Promise<Evento> {
    return await this.eventoService.updateEvento(id, updateEventoDto, accessToken, refreshToken);
  }
}
