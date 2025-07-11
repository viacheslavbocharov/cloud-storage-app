import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'JWT_REFRESH_EXPIRATION',
    'SMTP_USER',
    'SMTP_PASS',
    'RESET_TOKEN_EXPIRATION',
    'FRONTEND_URL',
    'FRONTEND_API_URL',
  ];
  requiredEnvVars.forEach((envVar) => {
    if (!configService.get(envVar)) {
      logger.error(`❌ Missing environment variable: ${envVar}`);
      process.exit(1); // Останавливаем приложение, если переменные отсутствуют
    }
  });

  // Проверяем подключение к MongoDB
  const mongoUri = configService.get<string>('MONGO_URI');
  try {
    await mongoose.connect(mongoUri);
    logger.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  logger.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
