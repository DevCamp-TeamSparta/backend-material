import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions } from '@nestjs/common';

export function getNestOptions(): NestApplicationOptions {
  const configService = new ConfigService();
  const env = configService.get<string>('RUNTIME');
  const serviceName = configService.get<string>('SERVICE_NAME');

  return {
    abortOnError: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(serviceName, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  };
}

export const corsOption = (env: string) => {
  return {
    origin: function (origin, callback) {
      if (
        !origin ||
        whiteList.indexOf(origin) !== -1 ||
        checkLocalWhiteList(env, origin) ||
        checkDeployedOnVercel(env, origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
  };
};

const allowed = {
  test: [''],
  prod: [],
};

const whiteList = [...allowed.test, ...allowed.prod];

const checkLocalWhiteList = (env, origin) => {
  return (
    (env === 'local' || env === 'test') &&
    (origin.includes('http://127.0.0.1') ||
      origin.includes('http://0.0.0.0') ||
      origin.includes('http://localhost'))
  );
};

const checkDeployedOnVercel = (env, origin) => {
  return env !== 'local' && origin.includes('vercel.app');
};
