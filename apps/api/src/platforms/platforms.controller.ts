import { Controller, Get, Headers } from '@nestjs/common';
import { parseToken } from '../common/auth.helpers';
import { PlatformRegistry } from './platform.registry';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platforms: PlatformRegistry) {}

  @Get()
  list(@Headers('authorization') authorization?: string) {
    parseToken(authorization);
    return this.platforms.list();
  }
}
