import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('API-Gateway');

  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });

    app.setGlobalPrefix('api');
    app.enableCors();

    app.use(bodyParser.json({ limit: '10mb' }));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const configService = app.get(ConfigService);
    const port = Number(configService.get('PORT')) || 3000;

    await app.listen(port);
    logger.log(`🚀 API Gateway is running on http://localhost:${port}/api`);
  } catch (error) {
    // Логируем ошибку при запуске
    Logger.error('❌ Failed to start API Gateway', error.stack);
    process.exit(1);
  }
}

bootstrap();
