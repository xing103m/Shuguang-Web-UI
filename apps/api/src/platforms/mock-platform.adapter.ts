import { PlatformAdapter, PlatformDeviceInfo, PlatformMonitorResult, PlatformOperationResult } from './platform.adapter';

export class MockPlatformAdapter implements PlatformAdapter {
  constructor(
    public readonly platformId: string,
    private readonly prefix: string
  ) {}

  async validateDevice(platformDeviceId: string): Promise<PlatformDeviceInfo> {
    const exists = platformDeviceId.toUpperCase().startsWith(this.prefix);
    return {
      exists,
      onlineStatus: exists ? 'online' : 'unknown',
      raw: { checkedBy: this.platformId, platformDeviceId }
    };
  }

  async dial(platformDeviceId: string): Promise<PlatformOperationResult> {
    const failed = platformDeviceId.includes('FAIL');
    return {
      status: failed ? 'failed' : 'success',
      raw: { action: 'dial', platformDeviceId, traceId: `${this.platformId}-dial-${Date.now()}` },
      error: failed ? 'Mock dial failure' : undefined
    };
  }

  async stress(platformDeviceId: string): Promise<PlatformOperationResult> {
    const failed = platformDeviceId.includes('LOW');
    return {
      status: failed ? 'failed' : 'success',
      raw: { action: 'stress', score: failed ? 45 : 92, platformDeviceId },
      error: failed ? 'Mock stress score below threshold' : undefined
    };
  }

  async monitor(platformDeviceId: string): Promise<PlatformMonitorResult> {
    const offline = platformDeviceId.includes('OFF');
    return {
      onlineStatus: offline ? 'offline' : 'online',
      bandwidthMbps: offline ? 0 : 100 + Math.round(Math.random() * 80),
      raw: { platformDeviceId, sampledAt: new Date().toISOString() }
    };
  }
}
