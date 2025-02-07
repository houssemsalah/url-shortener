import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true })
  urlId: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  deviceType: string;

  @Prop()
  browser: string;

  @Prop()
  operatingSystem: string;

  @Prop()
  referrer: string;
  createdAt: Date;  
  updatedAt: Date;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
