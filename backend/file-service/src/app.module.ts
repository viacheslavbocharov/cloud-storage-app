import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './modules/file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FolderModule } from './modules/folder/folder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    FileModule,
    FolderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
