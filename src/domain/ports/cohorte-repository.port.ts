import { Cohorte } from '../entities/cohorte.entity';

export interface CohorteRepositoryPort {
  findById(id: string): Promise<Cohorte | null>;
  findAll(): Promise<Cohorte[]>;
  save(cohorte: Cohorte): Promise<Cohorte>;
  update(id: string, cohorte: Partial<Cohorte>): Promise<Cohorte>;
  delete(id: string): Promise<void>;
}
