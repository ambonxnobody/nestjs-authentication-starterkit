import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      origin: process.env.APP_CORS_ORIGIN.split(','),
      allowedHeaders: [
        'X-Xsrf-Token',
        'X-Requested-With',
        'X-HTTP-Method-Override',
        'Content-Type',
        'Accept',
        'Authorization',
        'Accept-Language',
      ],
      credentials: true,
    },
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME + ' API')
    .setDescription(process.env.APP_NAME + ' API description')
    .setVersion('1.0.0')
    .setContact(
      '{developer_name}',
      '{developer_portfolio}',
      '{developer_email}',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: process.env.APP_NAME + ' API Documentation',
    customfavIcon: '../favicon.ico',
    jsonDocumentUrl: '/docs/json',
    yamlDocumentUrl: '/docs/yaml',
  });

  await app.listen(parseInt(process.env.APP_PORT) || 3000);
}
bootstrap();
