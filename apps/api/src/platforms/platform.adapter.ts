import { DeviceOnlineStatus, OperationStatus } from '../common/domain';

export interface PlatformDeviceInfo {
  exists: boolean;
  onlineStatus: DeviceOnlineStatus;
  raw: Record<string, unknown>;
}

export interface PlatformOperationResult {
  status: OperationStatus;
  raw: Record<string, unknown>;
  error?: string;
}

export interface PlatformMonitorResult {
  onlineStatus: DeviceOnlineStatus;
  bandwidthMbps: number;
  raw: Record<string, unknown>;
}

export interface PlatformAdapter {
  platformId: string;
  validateDevice(platformDeviceId: string): Promise<PlatformDeviceInfo>;
  dial(platformDeviceId: string): Promise<PlatformOperationResult>;
  stress(platformDeviceId: string): Promise<PlatformOperationResult>;
  monitor(platformDeviceId: string): Promise<PlatformMonitorResult>;
}
