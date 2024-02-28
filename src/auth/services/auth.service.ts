import { HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import {
  AccessLogRepository,
  AccessTokenRepository,
  RefreshTokenRepository,
  UserRepository,
} from '../repositories';
import { User } from '../entities';
import { BusinessException } from '../../exception';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResDto } from '../dto';
import { TokenBlacklistService } from './token-blacklist.service';
import { RequestInfo, TokenPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly accessLogRepository: AccessLogRepository,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(
    email: string,
    plainPassword: string,
    req: RequestInfo,
  ): Promise<LoginResDto> {
    const user = await this.validateUser(email, plainPassword);
    const payload: TokenPayload = this.createTokenPayload(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user, payload),
      this.createRefreshToken(user, payload),
    ]);

    const { ip, endpoint, ua } = req;
    await this.accessLogRepository.createAccessLog(user, ua, endpoint, ip);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async loginOauth(user: User, req: RequestInfo): Promise<LoginResDto> {
    const payload: TokenPayload = this.createTokenPayload(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user, payload),
      this.createRefreshToken(user, payload),
    ]);

    const { ip, endpoint, ua } = req;
    await this.accessLogRepository.createAccessLog(user, ua, endpoint, ip);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    const [jtiAccess, jtiRefresh] = await Promise.all([
      this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
      this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    ]);
    await Promise.all([
      this.addToBlacklist(
        accessToken,
        jtiAccess,
        'access',
        'ACCESS_TOKEN_EXPIRY',
      ),
      this.addToBlacklist(
        refreshToken,
        jtiRefresh,
        'refresh',
        'REFRESH_TOKEN_EXPIRY',
      ),
    ]);
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const { exp, ...payload } = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const user = await this.userRepository.findOneBy({ id: payload.sub });
      if (!user) {
        throw new BusinessException(
          'auth',
          'user-not-found',
          'User not found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return this.createAccessToken(user, payload as TokenPayload);
    } catch (error) {
      throw new BusinessException(
        'auth',
        'invalid-refresh-token',
        'Invalid refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  createTokenPayload(userId: string): TokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }

  async createAccessToken(user: User, payload: TokenPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.accessTokenRepository.saveAccessToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );

    return token;
  }

  async createRefreshToken(user: User, payload: TokenPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.refreshTokenRepository.saveRefreshToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );

    return token;
  }

  private async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await argon2.verify(user.password, plainPassword))) {
      return user;
    }
    throw new BusinessException(
      'auth',
      'invalid-credentials',
      'Invalid credentials',
      HttpStatus.UNAUTHORIZED,
    );
  }

  private async addToBlacklist(
    token: string,
    jti: string,
    type: 'access' | 'refresh',
    expiryConfigKey: string,
  ): Promise<void> {
    const expiryTime = this.calculateExpiry(
      this.configService.get<string>(expiryConfigKey),
    );
    await this.tokenBlacklistService.addToBlacklist(
      token,
      jti,
      type,
      expiryTime,
    );
  }

  private calculateExpiry(expiry: string): Date {
    let expiresInMilliseconds = 0;

    if (expiry.endsWith('d')) {
      const days = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = days * 24 * 60 * 60 * 1000;
    } else if (expiry.endsWith('h')) {
      const hours = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = hours * 60 * 60 * 1000;
    } else if (expiry.endsWith('m')) {
      const minutes = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = minutes * 60 * 1000;
    } else if (expiry.endsWith('s')) {
      const seconds = parseInt(expiry.slice(0, -1), 10);
      expiresInMilliseconds = seconds * 1000;
    } else {
      throw new BusinessException(
        'auth',
        'invalid-expiry',
        'Invalid expiry time',
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Date(Date.now() + expiresInMilliseconds);
  }
}
