import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerBuilderModule } from './swagger/swagger-builder.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  SwaggerBuilderModule.createSpec(app, {
    title: 'Ally Waste API',
    description: 'Valet trash and recycling logistics platform API',
    version: '1.0',
    path: 'docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API running on: http://localhost:${port}/api`);
  console.log(`Health check:   http://localhost:${port}/api/health`);
  console.log(`Swagger docs:   http://localhost:${port}/docs`);
}
bootstrap();
