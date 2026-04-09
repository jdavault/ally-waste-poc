import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerBuilderModule } from './swagger/swagger-builder.module';

async function bootstrap() {
  console.log('Starting API bootstrap...');
  try {
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

    const port = Number(process.env.PORT) || 8080;
    await app.listen(port, '0.0.0.0');

    console.log(`API is listening on 0.0.0.0:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  } catch (error) {
    console.error('Failed to start API:', error);
    process.exit(1);
  }
}
bootstrap().catch((err) => {
  console.error('Unhandled bootstrap error:', err);
  process.exit(1);
});
