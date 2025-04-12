import { CreateGroupDto } from '@lib/grpc/dist/typings/social_service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocialService {
    public constructor(private prismaService: PrismaService,) {}

    async createGroup(request: CreateGroupDto) {
        
    }
}
