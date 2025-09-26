import { Injectable } from '@nestjs/common';
import { CohorteService } from '../services/cohorte.service';
import { Cohorte } from '../../domain/entities/cohorte.entity';

@Injectable()
export class SyncCohorteFromClassroomUseCase {
  constructor(private readonly cohorteService: CohorteService) {}

  async execute(courseId: string, accessToken: string, refreshToken?: string): Promise<Cohorte | null> {
    return await this.cohorteService.syncCohorteFromClassroom(courseId, accessToken, refreshToken);
  }
}
