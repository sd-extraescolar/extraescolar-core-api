import { Injectable, Inject } from '@nestjs/common';
import { Cohorte } from '@domain/entities';
import { CohorteRepositoryPort, COHORTE_REPOSITORY_PORT } from '@domain/ports';

@Injectable()
export class GetCohorteUseCase {
  constructor(
    @Inject(COHORTE_REPOSITORY_PORT)
    private readonly cohorteRepository: CohorteRepositoryPort
  ) {}

  async execute(cohorteId: string): Promise<Cohorte | null> {
    return await this.cohorteRepository.findById(cohorteId);
  }
}
