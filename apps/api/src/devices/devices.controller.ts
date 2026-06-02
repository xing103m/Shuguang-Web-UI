import { Body, Controller, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { parseToken } from '../common/auth.helpers';
import { DevicesService } from './devices.service';

class BindDeviceDto {
  @IsString()
  platformId!: string;

  @IsString()
  platformDeviceId!: string;

  @IsOptional()
  @IsString()
  agentId?: string;
}

@Controller('devices')
export class DevicesController {
  constructor(private readonly devices: DevicesService) {}

  @Get()
  list(
    @Headers('authorization') authorization?: string,
    @Query('keyword') keyword?: string,
    @Query('platformId') platformId?: string,
    @Query('onlineStatus') onlineStatus?: string
  ) {
    return this.devices.list(parseToken(authorization), { keyword, platformId, onlineStatus });
  }

  @Get(':id')
  get(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    return this.devices.get(parseToken(authorization), id);
  }

  @Post('bind')
  bind(@Body() dto: BindDeviceDto, @Headers('authorization') authorization?: string) {
    return this.devices.bind(parseToken(authorization), dto);
  }
}
