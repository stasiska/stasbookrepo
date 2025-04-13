import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth2/auth.module';
import { PostModule } from './post-service/post.module';
import { SocialModule } from './social-service/social.module';

@Module({
  imports: [
    AuthModule,
    PostModule,
    SocialModule,
    ConfigModule.forRoot({
    isGlobal: true,
  }),

  ],
  controllers: [],
})
export class AppModule {}
