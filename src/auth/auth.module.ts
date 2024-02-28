import { Module } from '@nestjs/common';
import {
  AccessLog,
  AccessToken,
  RefreshToken,
  TokenBlacklist,
  User,
} from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AccessLogRepository,
  AccessTokenRepository,
  RefreshTokenRepository,
  TokenBlacklistRepository,
  UserRepository,
} from './repositories';
import { AuthService, TokenBlacklistService, UserService } from './services';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      User,
      AccessToken,
      RefreshToken,
      AccessLog,
      TokenBlacklist,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    TokenBlacklistService,

    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    AccessLogRepository,
    TokenBlacklistRepository,

    JwtStrategy,
  ],
  exports: [
    UserService,
    AuthService,
    TokenBlacklistService,

    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    AccessLogRepository,
    TokenBlacklistRepository,

    JwtStrategy,
  ],
})
export class AuthModule {}
