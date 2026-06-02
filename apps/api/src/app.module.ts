import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DevicesController } from './devices/devices.controller';
import { DevicesService } from './devices/devices.service';
import { MonitoringController } from './monitoring/monitoring.controller';
import { MonitoringService } from './monitoring/monitoring.service';
import { OperationsController } from './operations/operations.controller';
import { OperationsService } from './operations/operations.service';
import { PlatformsController } from './platforms/platforms.controller';
import { PlatformRegistry } from './platforms/platform.registry';
import { InMemoryStore } from './common/in-memory.store';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    AuthController,
    DevicesController,
    PlatformsController,
    OperationsController,
    MonitoringController
  ],
  providers: [
    InMemoryStore,
    AuthService,
    DevicesService,
    PlatformRegistry,
    OperationsService,
    MonitoringService
  ]
})
export class AppModule {}
