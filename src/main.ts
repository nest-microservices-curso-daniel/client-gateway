import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common';
import { envs } from './configs';

async function bootstrap() {
  const logger = new Logger('Main client gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new RpcCustomExceptionFilter())
  await app.listen(envs.port);
  logger.log(`Products microservice is listening on port: ${envs.port}`);
}
bootstrap();
