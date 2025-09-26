import { Injectable } from '@nestjs/common';
import { EventoService } from '../services/evento.service';
import { Evento } from '../../domain/entities/evento.entity';

@Injectable()
export class GetEventoUseCase {
  constructor(private readonly eventoService: EventoService) {}

  async execute(id: string): Promise<Evento> {
    return await this.eventoService.getEventoById(id);
  }
}
