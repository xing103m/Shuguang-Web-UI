import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { assertAgentAccess, canAccessAgent } from '../common/auth.helpers';
import { Device, RequestUser } from '../common/domain';
import { InMemoryStore } from '../common/in-memory.store';
import { PlatformRegistry } from '../platforms/platform.registry';

interface DeviceQuery {
  keyword?: string;
  platformId?: string;
  onlineStatus?: string;
}

@Injectable()
export class DevicesService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly platforms: PlatformRegistry
  ) {}

  list(user: RequestUser, query: DeviceQuery) {
    return this.store.devices
      .filter((device) => canAccessAgent(user, device.agentId))
      .filter((device) => !query.platformId || device.platformId === query.platformId)
      .filter((device) => !query.onlineStatus || device.onlineStatus === query.onlineStatus)
      .filter((device) => {
        if (!query.keyword) {
          return true;
        }
        return device.platformDeviceId.toLowerCase().includes(query.keyword.toLowerCase());
      })
      .map((device) => this.enrich(device));
  }

  get(user: RequestUser, id: string) {
    const device = this.store.devices.find((item) => item.id === id);
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    assertAgentAccess(user, device.agentId);
    return this.enrich(device);
  }

  async bind(user: RequestUser, input: { platformId: string; platformDeviceId: string; agentId?: string }) {
    const agentId = user.role === 'admin' ? input.agentId : user.agentId;
    if (!agentId) {
      throw new BadRequestException('agentId is required');
    }
    assertAgentAccess(user, agentId);

    const duplicated = this.store.devices.find(
      (item) => item.platformId === input.platformId && item.platformDeviceId === input.platformDeviceId
    );
    if (duplicated) {
      throw new BadRequestException('Device already bound');
    }

    const adapter = this.platforms.getAdapter(input.platformId);
    const validation = await adapter.validateDevice(input.platformDeviceId);
    if (!validation.exists) {
      throw new BadRequestException('Device does not exist on platform');
    }

    const device: Device = {
      id: this.store.id('dev'),
      platformId: input.platformId,
      platformDeviceId: input.platformDeviceId,
      agentId,
      onlineStatus: validation.onlineStatus,
      dialStatus: 'idle',
      stressStatus: 'idle',
      lastMonitorAt: new Date().toISOString(),
      raw: validation.raw,
      createdAt: new Date().toISOString()
    };
    this.store.devices.unshift(device);
    return this.enrich(device);
  }

  private enrich(device: Device) {
    return {
      ...device,
      platform: this.store.platforms.find((item) => item.id === device.platformId),
      agent: this.store.agents.find((item) => item.id === device.agentId)
    };
  }
}
