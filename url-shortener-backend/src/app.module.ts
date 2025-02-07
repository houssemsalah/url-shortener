import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import databaseConfig from './config/db.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'), 

      }),
      inject: [ConfigService],
    }),
    UrlModule
  ],
})
export class AppModule {}