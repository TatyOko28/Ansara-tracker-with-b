// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Configuration CORS
  const corsOrigins = [
    'http://localhost:3000',               // Front local
    process.env.FRONTEND_URL || ''         // URL front en prod (Vercel, etc.)
  ].filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  console.log(`✅ CORS origins: ${JSON.stringify(corsOrigins)}`);

  // 🔹 Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('ANSARA TRACKER')
    .setDescription('ANSARA TRACKER - Time Tracker API')
    .setVersion('1.0')
    .addTag('ANSARA')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🔹 Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 🔹 Port et lancement
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 = accepte connexions externes
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
