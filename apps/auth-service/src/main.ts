import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { GlobalExceptionFilter } from './auth/decorators/exceptions/conflictException';
import { authServiceGrpcServerOptions } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,authServiceGrpcServerOptions);
	app.useGlobalFilters(new GlobalExceptionFilter());


	await app.listen();
}
bootstrap();

