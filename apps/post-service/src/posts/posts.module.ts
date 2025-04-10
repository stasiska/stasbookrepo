import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts-grpc.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedCacheModule } from '@lib/cache/dist/cache.module'

@Module({
  imports: [SharedCacheModule],
  controllers: [PostsController],
  providers: [PostsService,PrismaService],
})
export class PostsModule {}
