// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const port = process.env.PORT || 3001; // Читаем из .env или используем 3001 по умолчанию
//   await app.listen(port);
//   console.log(`🚀 Server is running on port ${port}`);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Проверяем переменные окружения
  const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRATION',
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

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  logger.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
