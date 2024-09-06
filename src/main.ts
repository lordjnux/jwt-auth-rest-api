import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('JWT-AUTH-REST-API');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  logger.verbose(`Running on port: ${process.env.PORT}`);
}
bootstrap();
