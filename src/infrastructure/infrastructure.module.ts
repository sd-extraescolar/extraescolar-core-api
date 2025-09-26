import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cohorte, Alumno, Evento } from '@domain/entities';
import { COHORTE_REPOSITORY_PORT, ALUMNO_REPOSITORY_PORT, EVENTO_REPOSITORY_PORT } from '@domain/ports';
import { CohorteRepository, AlumnoRepository, EventoRepository } from './repositories';
import { GoogleClassroomService } from './services/google-classroom.service';
import { GoogleOAuthService } from './auth/google-oauth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cohorte, Alumno, Evento])],
  providers: [
    {
      provide: COHORTE_REPOSITORY_PORT,
      useClass: CohorteRepository,
    },
    {
      provide: ALUMNO_REPOSITORY_PORT,
      useClass: AlumnoRepository,
    },
    {
      provide: EVENTO_REPOSITORY_PORT,
      useClass: EventoRepository,
    },
    GoogleClassroomService,
    GoogleOAuthService,
  ],
  exports: [COHORTE_REPOSITORY_PORT, ALUMNO_REPOSITORY_PORT, EVENTO_REPOSITORY_PORT, GoogleClassroomService, GoogleOAuthService],
})
export class InfrastructureModule {}
