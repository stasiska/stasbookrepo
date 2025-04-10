import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constans';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth2/auth.module';
import { PostModule } from './post-service/post.module';

@Module({
  imports: [
    AuthModule,
    PostModule,
    ConfigModule.forRoot({
    isGlobal: true,
  }),

  ],
  controllers: [],
})
export class AppModule {}
