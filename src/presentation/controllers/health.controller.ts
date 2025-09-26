import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async getHealth() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'unknown',
        connected: false,
        error: undefined as string | undefined,
      },
    };

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        health.database.status = 'connected';
        health.database.connected = true;
      } else {
        health.database.status = 'not_initialized';
      }
    } catch (error) {
      health.database.status = 'error';
      health.database.error = error.message;
    }

    return health;
  }

  @Get('ready')
  async getReadiness() {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        return { status: 'ready', timestamp: new Date().toISOString() };
      }
      return { status: 'not_ready', timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        status: 'not_ready', 
        error: error.message,
        timestamp: new Date().toISOString() 
      };
    }
  }

  @Get('live')
  getLiveness() {
    return { 
      status: 'alive', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
