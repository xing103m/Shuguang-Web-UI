import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InMemoryStore } from '../common/in-memory.store';

@Injectable()
export class AuthService {
  constructor(private readonly store: InMemoryStore) {}

  login(username: string, password: string) {
    const user = this.store.users.find((item) => item.username === username && item.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const token = Buffer.from(`${user.id}:${user.role}:${user.agentId ?? ''}`).toString('base64url');
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        agentId: user.agentId,
        displayName: user.displayName
      }
    };
  }
}
