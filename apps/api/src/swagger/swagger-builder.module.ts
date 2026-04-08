import { INestApplication, Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  include?: Type<any>[];
  title?: string;
  description?: string;
  version?: string;
  path?: string;
}

export class SwaggerBuilderModule {
  static createSpec(app: INestApplication, options: SwaggerOptions = {}) {
    const {
      include = [],
      title = 'Ally Waste API',
      description = 'Valet trash and recycling logistics platform API',
      version = '1.0',
      path = 'spec',
    } = options;

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addTag('health', 'Health check endpoints')
      .addTag('properties', 'Property management')
      .addTag('buildings', 'Building management')
      .addTag('units', 'Unit management')
      .addTag('schedules', 'Pickup schedule management')
      .addTag('workers', 'Worker management')
      .addTag('routes', 'Route management')
      .addTag('tracking', 'GPS tracking')
      .addTag('sync', 'Mobile sync')
      .addTag('events', 'Event log')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: include.length > 0 ? include : undefined,
    });

    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    return document;
  }
}
