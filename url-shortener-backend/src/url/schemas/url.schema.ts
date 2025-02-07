import 'reflect-metadata';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop()
  lastAccessed?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
