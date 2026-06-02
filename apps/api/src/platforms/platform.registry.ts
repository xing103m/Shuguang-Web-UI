import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../common/in-memory.store';
import { MockPlatformAdapter } from './mock-platform.adapter';
import { PlatformAdapter } from './platform.adapter';

@Injectable()
export class PlatformRegistry {
  private adapters: Map<string, PlatformAdapter>;

  constructor(private readonly store: InMemoryStore) {
    this.adapters = new Map([
      ['mock-alpha', new MockPlatformAdapter('mock-alpha', 'ALPHA')],
      ['mock-beta', new MockPlatformAdapter('mock-beta', 'BETA')]
    ]);
  }

  list() {
    return this.store.platforms;
  }

  getAdapter(platformId: string) {
    const platform = this.store.platforms.find((item) => item.id === platformId && item.enabled);
    const adapter = this.adapters.get(platformId);
    if (!platform || !adapter) {
      throw new NotFoundException(`Platform ${platformId} is not available`);
    }
    return adapter;
  }
}
