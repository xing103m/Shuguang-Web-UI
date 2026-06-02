import { describe, expect, it } from 'vitest';
import { MockPlatformAdapter } from '../src/platforms/mock-platform.adapter';

describe('MockPlatformAdapter', () => {
  it('validates platform device prefix', async () => {
    const adapter = new MockPlatformAdapter('mock-alpha', 'ALPHA');
    await expect(adapter.validateDevice('ALPHA-10001')).resolves.toMatchObject({ exists: true });
    await expect(adapter.validateDevice('BETA-10001')).resolves.toMatchObject({ exists: false });
  });

  it('returns operation failures for failure markers', async () => {
    const adapter = new MockPlatformAdapter('mock-alpha', 'ALPHA');
    await expect(adapter.dial('ALPHA-FAIL')).resolves.toMatchObject({ status: 'failed' });
    await expect(adapter.stress('ALPHA-LOW')).resolves.toMatchObject({ status: 'failed' });
  });
});
