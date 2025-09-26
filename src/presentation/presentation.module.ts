import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { CohorteController, HealthController } from './controllers';

@Module({
  imports: [ApplicationModule],
  controllers: [CohorteController, HealthController],
})
export class PresentationModule {}
