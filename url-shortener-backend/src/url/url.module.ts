import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url, UrlSchema } from './schemas/url.schema';
import { AnalyticsModule } from 'src/analytics/analytics.module';



@Module({
  imports: [ AnalyticsModule,
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])
  ],
  controllers: [UrlController],
  providers: [UrlService ],

})
export class UrlModule {}