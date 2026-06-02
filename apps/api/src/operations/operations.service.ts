import { Injectable, NotFoundException } from '@nestjs/common';
import { assertAgentAccess } from '../common/auth.helpers';
import { OperationLog, OperationType, RequestUser } from '../common/domain';
import { InMemoryStore } from '../common/in-memory.store';
import { PlatformRegistry } from '../platforms/platform.registry';

@Injectable()
export class OperationsService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly platforms: PlatformRegistry
  ) {}

  list(user: RequestUser) {
    return this.store.operationLogs.filter((log) => user.role === 'admin' || log.agentId === user.agentId);
  }

  async run(user: RequestUser, deviceId: string, type: OperationType) {
    const device = this.store.devices.find((item) => item.id === deviceId);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    assertAgentAccess(user, device.agentId);

    const adapter = this.platforms.getAdapter(device.platformId);
    const request = { platformDeviceId: device.platformDeviceId, type };
    const result = type === 'dial' ? await adapter.dial(device.platformDeviceId) : await adapter.stress(device.platformDeviceId);
    const now = new Date().toISOString();

    if (type === 'dial') {
      device.dialStatus = result.status;
    } else {
      device.stressStatus = result.status;
    }
    device.lastOperationAt = now;

    const log: OperationLog = {
      id: this.store.id('op'),
      deviceId: device.id,
      agentId: device.agentId,
      platformId: device.platformId,
      type,
      status: result.status,
      request,
      response: result.raw,
      error: result.error,
      createdAt: now
    };
    this.store.operationLogs.unshift(log);

    if (result.status === 'failed') {
      this.store.alerts.unshift({
        id: this.store.id('alert'),
        agentId: device.agentId,
        deviceId: device.id,
        platformId: device.platformId,
        type: type === 'dial' ? 'dial_failed' : 'stress_failed',
        level: 'warning',
        message: `${device.platformDeviceId} ${type === 'dial' ? '拨号' : '压测'}失败`,
        resolved: false,
        createdAt: now
      });
    }

    return log;
  }
}
