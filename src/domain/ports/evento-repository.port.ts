import { Evento } from '../entities/evento.entity';

export interface EventoRepositoryPort {
  findById(id: string): Promise<Evento | null>;
  findByCohorteId(cohorteId: string): Promise<Evento[]>;
  save(evento: Evento): Promise<Evento>;
  update(evento: Evento): Promise<Evento>;
  delete(id: string): Promise<void>;
  findByCohorteIdAndDate(cohorteId: string, fecha: Date): Promise<Evento | null>;
}
