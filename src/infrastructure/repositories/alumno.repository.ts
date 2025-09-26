import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from '@domain/entities';
import { AlumnoRepositoryPort, ALUMNO_REPOSITORY_PORT } from '@domain/ports';

@Injectable()
export class AlumnoRepository implements AlumnoRepositoryPort {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
  ) {}

  async findById(id: string): Promise<Alumno | null> {
    return await this.alumnoRepository.findOne({
      where: { id },
      relations: ['cohorte'],
    });
  }

  async findByCohorteId(cohorteId: string): Promise<Alumno[]> {
    return await this.alumnoRepository.find({
      where: { fk_cohorte_id: cohorteId },
      relations: ['cohorte'],
    });
  }

  async save(alumno: Alumno): Promise<Alumno> {
    return await this.alumnoRepository.save(alumno);
  }

  async update(id: string, alumnoData: Partial<Alumno>): Promise<Alumno> {
    await this.alumnoRepository.update(id, alumnoData);
    const updatedAlumno = await this.findById(id);
    if (!updatedAlumno) {
      throw new Error('Alumno not found after update');
    }
    return updatedAlumno;
  }

  async delete(id: string): Promise<void> {
    await this.alumnoRepository.delete(id);
  }
}
