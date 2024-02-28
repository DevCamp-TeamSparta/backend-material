import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from '../entities';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async saveRefreshToken(
    jti: string,
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.jti = jti;
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiresAt = expiresAt;
    refreshToken.isRevoked = false;
    return this.save(refreshToken);
  }
}
