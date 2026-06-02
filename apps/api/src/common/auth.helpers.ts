import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { RequestUser } from './domain';

export function parseToken(authorization?: string): RequestUser {
  const token = authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    throw new UnauthorizedException('Missing bearer token');
  }
  const decoded = Buffer.from(token, 'base64url').toString('utf8');
  const [userId, role, agentId] = decoded.split(':');
  if (!userId || (role !== 'admin' && role !== 'agent')) {
    throw new UnauthorizedException('Invalid bearer token');
  }
  return { userId, role, agentId: agentId || undefined };
}

export function canAccessAgent(user: RequestUser, agentId: string) {
  if (user.role === 'admin') {
    return true;
  }
  return user.agentId === agentId;
}

export function assertAgentAccess(user: RequestUser, agentId: string) {
  if (!canAccessAgent(user, agentId)) {
    throw new ForbiddenException('No permission for this agent data');
  }
}
