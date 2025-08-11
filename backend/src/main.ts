import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = [
    'http://localhost:3000',               
    process.env.FRONTEND_URL || ''         
  ].filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  console.log(`✅ CORS origins: ${JSON.stringify(corsOrigins)}`);

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0'); 
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
