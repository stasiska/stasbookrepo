import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service/auth-service.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constans';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 3001,
        }
      },
    ])
  ],
  controllers: [ AuthServiceController],
})
export class AppModule {}
