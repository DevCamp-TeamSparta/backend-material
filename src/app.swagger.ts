import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import basicAuth from 'express-basic-auth';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

export const swaggerAuthMiddleware = (id: string, pw: string) =>
  basicAuth({
    users: { [id]: pw },
    challenge: true,
    unauthorizedResponse: 'Unauthorized',
  });

export function setSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const serviceName = configService.get<number>('SERVICE_NAME');
  const swaggerId = configService.get<string>('SWAGGER_ID');
  const swaggerPw = configService.get<string>('SWAGGER_PW');
  const config = new DocumentBuilder()
    .setTitle(`${serviceName} API Docs`)
    .setDescription(`${serviceName} API 문서입니다.`)
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'plain')
    app.use(
      '/api-docs',
      swaggerAuthMiddleware(swaggerId, swaggerPw),
      (req: Request, res: Response, next: NextFunction) => {
        next();
      },
    );
  SwaggerModule.setup('api-docs', app, document);
}
