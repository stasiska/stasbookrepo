import { Injectable } from '@nestjs/common';
import { S3Service } from '@lib/s3/dist/index';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class PostsService {

    constructor(private prismaService: PrismaService){}

    async createPost (request) {
        return {
            id: "dfs",
            content: 'st',
            media: [],
            authorId: 'stasts',
            createdAt: undefined,
            updatedAt: undefined,
            likes: [],
            comments: []
        }
    }
}
