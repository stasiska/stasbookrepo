import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { configParserFactory } from '@lib/shared/dist';
import { config, ConfigSchema } from './config';
import { LoggerModule } from '@lib/logger/dist';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,

  }),PostsModule, PrismaModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
