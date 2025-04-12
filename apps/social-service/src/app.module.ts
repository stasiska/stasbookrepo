import { Module } from '@nestjs/common';
import { SocialModule } from './social/social.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SocialModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
