import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts-grpc.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedCacheModule } from '@lib/cache/dist/cache.module'
import { ClientsModule } from '@nestjs/microservices';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';

@Module({
  imports: [GrpcClientModule,SharedCacheModule],
  controllers: [PostsController],
  providers: [PostsService,PrismaService],
})
export class PostsModule {}
