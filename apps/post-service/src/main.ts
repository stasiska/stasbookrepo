import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { postServiceGrpcServerOptions } from './config';
import { GrpcExceptionFilter } from '@lib/shared/dist/index'
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,postServiceGrpcServerOptions);
  
  const config = new ConfigService()
  app.useGlobalFilters(new GrpcExceptionFilter())
  console.log('started on port localhost:55013')
  await app.listen();
}
bootstrap();
