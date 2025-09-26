import { Injectable } from '@nestjs/common';
import { EventoService } from '../services/evento.service';
import { Evento } from '../../domain/entities/evento.entity';

@Injectable()
export class GetEventosByCohorteUseCase {
  constructor(private readonly eventoService: EventoService) {}

  async execute(cohorteId: string): Promise<Evento[]> {
    return await this.eventoService.getEventosByCohorteId(cohorteId);
  }
}
