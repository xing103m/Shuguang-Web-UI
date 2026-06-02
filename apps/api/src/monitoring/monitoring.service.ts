import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { canAccessAgent } from '../common/auth.helpers';
import { RequestUser } from '../common/domain';
import { InMemoryStore } from '../common/in-memory.store';
import { PlatformRegistry } from '../platforms/platform.registry';

@Injectable()
export class MonitoringService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly platforms: PlatformRegistry
  ) {}

  summary(user: RequestUser) {
    const devices = this.store.devices.filter((device) => canAccessAgent(user, device.agentId));
    const alerts = this.store.alerts.filter((alert) => user.role === 'admin' || alert.agentId === user.agentId);
    return {
      totalDevices: devices.length,
      onlineDevices: devices.filter((item) => item.onlineStatus === 'online').length,
      offlineDevices: devices.filter((item) => item.onlineStatus === 'offline').length,
      activeAlerts: alerts.filter((item) => !item.resolved).length,
      latestSnapshots: this.store.monitorSnapshots
        .filter((snapshot) => user.role === 'admin' || snapshot.agentId === user.agentId)
        .slice(0, 20)
    };
  }

  alerts(user: RequestUser) {
    return this.store.alerts.filter((alert) => user.role === 'admin' || alert.agentId === user.agentId);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncAllDevices() {
    for (const device of this.store.devices) {
      try {
        const adapter = this.platforms.getAdapter(device.platformId);
        const result = await adapter.monitor(device.platformDeviceId);
        const now = new Date().toISOString();
        device.onlineStatus = result.onlineStatus;
        device.lastMonitorAt = now;
        device.raw = { ...device.raw, latestMonitor: result.raw };
        this.store.monitorSnapshots.unshift({
          id: this.store.id('mon'),
          deviceId: device.id,
          agentId: device.agentId,
          platformId: device.platformId,
          onlineStatus: result.onlineStatus,
          bandwidthMbps: result.bandwidthMbps,
          raw: result.raw,
          createdAt: now
        });
        if (result.onlineStatus === 'offline') {
          this.store.alerts.unshift({
            id: this.store.id('alert'),
            agentId: device.agentId,
            deviceId: device.id,
            platformId: device.platformId,
            type: 'device_offline',
            level: 'warning',
            message: `设备 ${device.platformDeviceId} 当前离线`,
            resolved: false,
            createdAt: now
          });
        }
      } catch (error) {
        this.store.alerts.unshift({
          id: this.store.id('alert'),
          agentId: device.agentId,
          deviceId: device.id,
          platformId: device.platformId,
          type: 'platform_api_error',
          level: 'critical',
          message: error instanceof Error ? error.message : '平台接口异常',
          resolved: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  }
}
