import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOption, getNestOptions } from './app.options';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { setSwagger } from './app.swagger';
import { BusinessExceptionFilter } from './exception';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, getNestOptions());
  app.useGlobalFilters(new BusinessExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const env = configService.get<string>('RUNTIME');
  const serviceName = configService.get<string>('SERVICE_NAME');
  console.log(`runtime: ${env}\tport: ${port}\tserviceName: ${serviceName}`);

  setSwagger(app);
  app.enableCors(corsOption(env));
  await app.listen(port);
}

void bootstrap();
