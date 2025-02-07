import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

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
    origin: 'http://localhost:3000', // Allow frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  await app.listen(3001);
 
}
bootstrap();