import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social-grpc.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SocialController],
  providers: [SocialService, PrismaService],
})
export class SocialModule {}
