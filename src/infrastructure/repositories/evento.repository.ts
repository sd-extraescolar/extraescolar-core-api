import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../../domain/entities/evento.entity';
import { EventoRepositoryPort } from '../../domain/ports/evento-repository.port';

@Injectable()
export class EventoRepository implements EventoRepositoryPort {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async findById(id: string): Promise<Evento | null> {
    return await this.eventoRepository.findOne({
      where: { id },
      relations: ['cohorte'],
    });
  }

  async findByCohorteId(cohorteId: string): Promise<Evento[]> {
    return await this.eventoRepository.find({
      where: { fk_cohorte_id: cohorteId },
      relations: ['cohorte'],
      order: { fecha: 'ASC' },
    });
  }

  async save(evento: Evento): Promise<Evento> {
    return await this.eventoRepository.save(evento);
  }

  async update(evento: Evento): Promise<Evento> {
    return await this.eventoRepository.save(evento);
  }

  async delete(id: string): Promise<void> {
    await this.eventoRepository.delete(id);
  }

  async findByCohorteIdAndDate(cohorteId: string, fecha: Date): Promise<Evento | null> {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.eventoRepository
      .createQueryBuilder('evento')
      .where('evento.fk_cohorte_id = :cohorteId', { cohorteId })
      .andWhere('evento.fecha >= :startOfDay', { startOfDay })
      .andWhere('evento.fecha <= :endOfDay', { endOfDay })
      .leftJoinAndSelect('evento.cohorte', 'cohorte')
      .getOne();
  }
}
