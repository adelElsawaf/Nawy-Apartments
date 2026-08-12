import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigin = config.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((value) => value.trim())
      : true,
  });

  // Static files stay outside /api so image URLs remain /uploads/images/...
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(Number(config.get('PORT', 3000)));
}
bootstrap();
