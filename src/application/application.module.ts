import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import {
  GetCohorteUseCase,
  GetAlumnoByCohorteUseCase,
  SyncCohorteFromClassroomUseCase,
  CreateEventoUseCase,
  UpdateEventoUseCase,
  GetEventoUseCase,
  GetEventosByCohorteUseCase,
  UpdateAttendanceUseCase,
} from './use-cases';
import { CohorteService, EventoService } from './services';

@Module({
  imports: [InfrastructureModule],
  providers: [
    GetCohorteUseCase,
    GetAlumnoByCohorteUseCase,
    SyncCohorteFromClassroomUseCase,
    CreateEventoUseCase,
    UpdateEventoUseCase,
    GetEventoUseCase,
    GetEventosByCohorteUseCase,
    UpdateAttendanceUseCase,
    CohorteService,
    EventoService,
  ],
  exports: [
    CohorteService, 
    EventoService, 
    SyncCohorteFromClassroomUseCase,
    CreateEventoUseCase,
    UpdateEventoUseCase,
    GetEventoUseCase,
    GetEventosByCohorteUseCase,
    UpdateAttendanceUseCase,
  ],
})
export class ApplicationModule {}
