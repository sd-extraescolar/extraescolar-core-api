import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CohorteController, HealthController, EventoController, AuthController } from './controllers';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [CohorteController, HealthController, EventoController, AuthController],
})
export class PresentationModule {}
