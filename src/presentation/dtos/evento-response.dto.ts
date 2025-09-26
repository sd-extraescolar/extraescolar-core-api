import { Evento } from '../../domain/entities/evento.entity';

export class EventoResponseDto {
  id: string;
  fk_cohorte_id: string;
  fecha: Date;
  alumnos_presentes: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(evento: Evento) {
    this.id = evento.id;
    this.fk_cohorte_id = evento.fk_cohorte_id;
    this.fecha = evento.fecha;
    this.alumnos_presentes = evento.alumnos_presentes;
    this.createdAt = evento.createdAt;
    this.updatedAt = evento.updatedAt;
  }
}
