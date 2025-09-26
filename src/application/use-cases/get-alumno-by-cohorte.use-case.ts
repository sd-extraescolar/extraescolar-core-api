import { Injectable, Inject } from '@nestjs/common';
import { Alumno } from '@domain/entities';
import { AlumnoRepositoryPort, ALUMNO_REPOSITORY_PORT } from '@domain/ports';

@Injectable()
export class GetAlumnoByCohorteUseCase {
  constructor(
    @Inject(ALUMNO_REPOSITORY_PORT)
    private readonly alumnoRepository: AlumnoRepositoryPort
  ) {}

  async execute(alumnoId: string, cohorteId: string): Promise<Alumno | null> {
    const alumno = await this.alumnoRepository.findById(alumnoId);
    
    if (!alumno || alumno.fk_cohorte_id !== cohorteId) {
      return null;
    }
    
    return alumno;
  }
}
