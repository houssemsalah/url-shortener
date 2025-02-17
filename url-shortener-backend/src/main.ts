import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import 'reflect-metadata';

const server = express();

export const createNestApp = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  // Swagger configuration
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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
};

let cachedApp: express.Express;

async function bootstrap() {
  if (!cachedApp) {
    const app = await createNestApp(server);
    cachedApp = server;

    // Only listen to port when running in development
    if (process.env.NODE_ENV !== 'production') {
      await app.listen(process.env.PORT || 3001);
    }
  }
  return cachedApp;
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export for serverless use
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}