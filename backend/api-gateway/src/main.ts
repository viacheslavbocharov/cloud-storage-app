import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('API-Gateway');

  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
    app.use(cookieParser());
    app.setGlobalPrefix('api');

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

    // ✅ Вывод зарегистрированных маршрутов
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const routes = [];

    router.stack.forEach((layer) => {
      if (layer.route) {
        routes.push({
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
          path: layer.route.path,
        });
      }
    });

    logger.log('🛣 Registered routes:');
    routes.forEach((r) => {
      logger.log(`→ ${r.method} ${r.path}`);
    });

    await app.listen(port);
    logger.log(`🚀 API Gateway is running on http://localhost:${port}/api`);
  } catch (error) {
    Logger.error('❌ Failed to start API Gateway', error.stack);
    process.exit(1);
  }
}

bootstrap();
