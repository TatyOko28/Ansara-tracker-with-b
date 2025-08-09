import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3000'], // Autorise uniquement votre front Next.js
    credentials: true,                // Autorise les cookies/sessions
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    allowedHeaders: 'Content-Type,Authorization', // Headers autorisés
  });

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('ANSARA TRACKER')
    .setDescription('ANSARA TRACKER - is the time tracker')
    .setVersion('1.0')
    .addTag('ANSARA')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
        name: 'jwt',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validation globale
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();