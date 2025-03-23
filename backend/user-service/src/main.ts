import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
  requiredEnvVars.forEach((envVar) => {
    if (!configService.get(envVar)) {
      logger.error(`❌ Missing environment variable: ${envVar}`);
      process.exit(1); // Останавливаем приложение, если переменные отсутствуют
    }
  });

  const mongoUri = configService.get<string>('MONGO_URI');
  try {
    await mongoose.connect(mongoUri);
    logger.log('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get<number>('PORT') || 3002;
  await app.listen(port);
  logger.log(`🚀 Server is running on port ${port}`);
}

bootstrap();
