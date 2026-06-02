import { Controller, Get, Headers } from '@nestjs/common';
import { parseToken } from '../common/auth.helpers';
import { MonitoringService } from './monitoring.service';

@Controller()
export class MonitoringController {
  constructor(private readonly monitoring: MonitoringService) {}

  @Get('dashboard')
  summary(@Headers('authorization') authorization?: string) {
    return this.monitoring.summary(parseToken(authorization));
  }

  @Get('alerts')
  alerts(@Headers('authorization') authorization?: string) {
    return this.monitoring.alerts(parseToken(authorization));
  }
}
