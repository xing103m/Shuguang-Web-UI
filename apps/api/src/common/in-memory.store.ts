import { Injectable } from '@nestjs/common';
import { Agent, Alert, Device, MonitorSnapshot, OperationLog, Platform, User } from './domain';

const now = () => new Date().toISOString();

@Injectable()
export class InMemoryStore {
  users: User[] = [
    { id: 'u-admin', username: 'admin', password: 'admin123', role: 'admin', displayName: '公司管理员' },
    { id: 'u-agent-a', username: 'agent-a', password: 'agent123', role: 'agent', agentId: 'agent-a', displayName: '华东代理' }
  ];

  agents: Agent[] = [
    { id: 'agent-a', name: '华东代理', contact: '13800000000', enabled: true },
    { id: 'agent-b', name: '华南代理', contact: '13900000000', enabled: true }
  ];

  platforms: Platform[] = [
    { id: 'mock-alpha', name: 'Alpha 平台', baseUrl: 'mock://alpha', authType: 'api_key', enabled: true },
    { id: 'mock-beta', name: 'Beta 平台', baseUrl: 'mock://beta', authType: 'token', enabled: true }
  ];

  devices: Device[] = [
    {
      id: 'dev-1',
      platformId: 'mock-alpha',
      platformDeviceId: 'ALPHA-10001',
      agentId: 'agent-a',
      onlineStatus: 'online',
      dialStatus: 'success',
      stressStatus: 'idle',
      lastMonitorAt: now(),
      createdAt: now(),
      raw: { province: '浙江', isp: '电信' }
    },
    {
      id: 'dev-2',
      platformId: 'mock-beta',
      platformDeviceId: 'BETA-20001',
      agentId: 'agent-b',
      onlineStatus: 'offline',
      dialStatus: 'idle',
      stressStatus: 'failed',
      lastMonitorAt: now(),
      createdAt: now(),
      raw: { province: '广东', isp: '联通' }
    }
  ];

  operationLogs: OperationLog[] = [];
  monitorSnapshots: MonitorSnapshot[] = [];
  alerts: Alert[] = [
    {
      id: 'alert-1',
      agentId: 'agent-b',
      deviceId: 'dev-2',
      platformId: 'mock-beta',
      type: 'device_offline',
      level: 'warning',
      message: '设备 BETA-20001 当前离线',
      resolved: false,
      createdAt: now()
    }
  ];

  id(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }
}
