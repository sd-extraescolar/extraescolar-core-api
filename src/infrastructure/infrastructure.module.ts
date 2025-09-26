import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cohorte, Alumno } from '@domain/entities';
import { COHORTE_REPOSITORY_PORT, ALUMNO_REPOSITORY_PORT } from '@domain/ports';
import { CohorteRepository, AlumnoRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Cohorte, Alumno])],
  providers: [
    {
      provide: COHORTE_REPOSITORY_PORT,
      useClass: CohorteRepository,
    },
    {
      provide: ALUMNO_REPOSITORY_PORT,
      useClass: AlumnoRepository,
    },
  ],
  exports: [COHORTE_REPOSITORY_PORT, ALUMNO_REPOSITORY_PORT],
})
export class InfrastructureModule {}
