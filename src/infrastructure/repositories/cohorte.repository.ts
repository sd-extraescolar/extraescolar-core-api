import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohorte } from '@domain/entities';
import { CohorteRepositoryPort, COHORTE_REPOSITORY_PORT } from '@domain/ports';

@Injectable()
export class CohorteRepository implements CohorteRepositoryPort {
  constructor(
    @InjectRepository(Cohorte)
    private readonly cohorteRepository: Repository<Cohorte>,
  ) {}

  async findById(id: string): Promise<Cohorte | null> {
    return await this.cohorteRepository.findOne({
      where: { id },
      relations: ['eventos', 'alumnos_entities'],
    });
  }

  async findAll(): Promise<Cohorte[]> {
    return await this.cohorteRepository.find({
      relations: ['eventos', 'alumnos_entities'],
    });
  }

  async save(cohorte: Cohorte): Promise<Cohorte> {
    return await this.cohorteRepository.save(cohorte);
  }

  async update(id: string, cohorteData: Partial<Cohorte>): Promise<Cohorte> {
    await this.cohorteRepository.update(id, cohorteData);
    const updatedCohorte = await this.findById(id);
    if (!updatedCohorte) {
      throw new Error('Cohorte not found after update');
    }
    return updatedCohorte;
  }

  async delete(id: string): Promise<void> {
    await this.cohorteRepository.delete(id);
  }
}
