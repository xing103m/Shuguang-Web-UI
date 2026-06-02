import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { parseToken } from '../common/auth.helpers';
import { OperationsService } from './operations.service';

@Controller()
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get('operations')
  list(@Headers('authorization') authorization?: string) {
    return this.operations.list(parseToken(authorization));
  }

  @Post('devices/:id/dial')
  dial(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    return this.operations.run(parseToken(authorization), id, 'dial');
  }

  @Post('devices/:id/stress')
  stress(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    return this.operations.run(parseToken(authorization), id, 'stress');
  }
}
