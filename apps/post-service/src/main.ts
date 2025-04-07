import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { postServiceGrpcServerOptions } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,postServiceGrpcServerOptions);
  console.log('started on port localhost:55013')
  await app.listen();
}
bootstrap();
