import { Injectable } from '@nestjs/common';
import { GetCohorteUseCase, GetAlumnoByCohorteUseCase } from '../use-cases';
import { Cohorte, Alumno } from '@domain/entities';

@Injectable()
export class CohorteService {
  constructor(
    private readonly getCohorteUseCase: GetCohorteUseCase,
    private readonly getAlumnoByCohorteUseCase: GetAlumnoByCohorteUseCase,
  ) {}

  async getCohorteById(cohorteId: string): Promise<Cohorte | null> {
    return await this.getCohorteUseCase.execute(cohorteId);
  }

  async getAlumnoByCohorte(alumnoId: string, cohorteId: string): Promise<Alumno | null> {
    return await this.getAlumnoByCohorteUseCase.execute(alumnoId, cohorteId);
  }
}
