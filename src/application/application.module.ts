import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import {
  GetCohorteUseCase,
  GetAlumnoByCohorteUseCase,
} from './use-cases';
import { CohorteService } from './services';

@Module({
  imports: [InfrastructureModule],
  providers: [
    GetCohorteUseCase,
    GetAlumnoByCohorteUseCase,
    CohorteService,
  ],
  exports: [CohorteService],
})
export class ApplicationModule {}
