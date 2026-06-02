import { describe, expect, it } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { assertAgentAccess, canAccessAgent } from '../src/common/auth.helpers';

describe('agent data isolation', () => {
  it('allows admin to access every agent', () => {
    expect(canAccessAgent({ userId: 'u-admin', role: 'admin' }, 'agent-a')).toBe(true);
  });

  it('allows agent to access own data only', () => {
    expect(canAccessAgent({ userId: 'u-agent-a', role: 'agent', agentId: 'agent-a' }, 'agent-a')).toBe(true);
    expect(canAccessAgent({ userId: 'u-agent-a', role: 'agent', agentId: 'agent-a' }, 'agent-b')).toBe(false);
  });

  it('throws when agent accesses other agent data', () => {
    expect(() => assertAgentAccess({ userId: 'u-agent-a', role: 'agent', agentId: 'agent-a' }, 'agent-b')).toThrow(
      ForbiddenException
    );
  });
});
