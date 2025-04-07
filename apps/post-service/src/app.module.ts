import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './libs/storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),PostsModule, PrismaModule, StorageModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
