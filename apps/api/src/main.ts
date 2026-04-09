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
    path: 'spec',
  });

  const port = process.env.PORT ?? 8080;
  await app.listen(port, '0.0.0.0');

  console.log(`API running on: http://0.0.0.0:${port}/api`);

  console.log(`Health check:   http://localhost:${port}/api/health`);
  console.log(`Swagger docs:   http://localhost:${port}/spec`);
}
void bootstrap();
