import { Injectable } from '@nestjs/common';
import { TokenBlacklistRepository } from '../repositories';

@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly tokenBlacklistRepository: TokenBlacklistRepository,
  ) {}

  async addToBlacklist(
    token: string,
    jti: string,
    type: 'access' | 'refresh',
    expiresAt: Date,
  ): Promise<void> {
    await this.tokenBlacklistRepository.addToken(token, jti, type, expiresAt);
  }

  async isTokenBlacklisted(jti: string): Promise<boolean> {
    return await this.tokenBlacklistRepository.isTokenBlacklisted(jti);
  }

  async removeExpiredTokens(): Promise<void> {
    await this.tokenBlacklistRepository.removeExpiredTokens();
  }
}
