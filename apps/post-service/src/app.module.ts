import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),PostsModule, PrismaModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
