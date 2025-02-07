import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import 'reflect-metadata';


// Create an Express instance
const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
   const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API for shortening URLs and tracking analytics')
    .setVersion('1.0')
    .addTag('URL Shortener')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Development origin
      'https://url-shortener-frontend-omega-lovat.vercel.app', // Production frontend origin
      'https://url-shortener-backend-iota.vercel.app', // Backend origin if needed
    ],
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  await app.listen(3001);
 
}
bootstrap();

// ✅ Export Express server for Vercel
export default server;