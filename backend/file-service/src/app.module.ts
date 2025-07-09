import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './modules/file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FolderModule } from './modules/folder/folder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanerModule } from './modules/cleaner/cleaner.module';
import { SearchModule } from './modules/search/search.module';
import { BinModule } from './modules/bin/bin.module';

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
    FolderModule,
    ScheduleModule.forRoot(),
    CleanerModule,
    SearchModule,
    BinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
