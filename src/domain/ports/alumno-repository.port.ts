import { Alumno } from '../entities/alumno.entity';

export interface AlumnoRepositoryPort {
  findById(id: string): Promise<Alumno | null>;
  findByCohorteId(cohorteId: string): Promise<Alumno[]>;
  save(alumno: Alumno): Promise<Alumno>;
  update(id: string, alumno: Partial<Alumno>): Promise<Alumno>;
  delete(id: string): Promise<void>;
}
