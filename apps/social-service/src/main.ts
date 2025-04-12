import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { socialServiceGrpcServerOptions } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, socialServiceGrpcServerOptions);
  const config = new ConfigService()
  console.log(`started on port ${config.getOrThrow('SOCIAL_SERVICE_URL')}`)
  await app.listen();
}
bootstrap();
