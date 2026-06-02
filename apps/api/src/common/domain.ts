export type Role = 'admin' | 'agent';
export type DeviceOnlineStatus = 'online' | 'offline' | 'unknown';
export type OperationType = 'dial' | 'stress';
export type OperationStatus = 'success' | 'failed' | 'running';
export type AlertType = 'device_offline' | 'dial_failed' | 'stress_failed' | 'platform_api_error';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  agentId?: string;
  displayName: string;
}

export interface Agent {
  id: string;
  name: string;
  contact?: string;
  enabled: boolean;
}

export interface Platform {
  id: string;
  name: string;
  baseUrl: string;
  authType: 'api_key' | 'token' | 'custom';
  enabled: boolean;
}

export interface Device {
  id: string;
  platformId: string;
  platformDeviceId: string;
  agentId: string;
  onlineStatus: DeviceOnlineStatus;
  dialStatus: OperationStatus | 'idle';
  stressStatus: OperationStatus | 'idle';
  lastMonitorAt?: string;
  lastOperationAt?: string;
  raw?: Record<string, unknown>;
  createdAt: string;
}

export interface OperationLog {
  id: string;
  deviceId: string;
  agentId: string;
  platformId: string;
  type: OperationType;
  status: OperationStatus;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  error?: string;
  createdAt: string;
}

export interface MonitorSnapshot {
  id: string;
  deviceId: string;
  agentId: string;
  platformId: string;
  onlineStatus: DeviceOnlineStatus;
  bandwidthMbps: number;
  raw: Record<string, unknown>;
  createdAt: string;
}

export interface Alert {
  id: string;
  agentId: string;
  deviceId?: string;
  platformId?: string;
  type: AlertType;
  level: 'warning' | 'critical';
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface RequestUser {
  userId: string;
  role: Role;
  agentId?: string;
}
