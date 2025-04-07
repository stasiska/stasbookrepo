import { PostServiceClientService } from '@lib/grpc/dist/client';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { S3Service } from '@lib/s3/dist/index';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
@Injectable()
export class PostService {
    constructor(private readonly postServiceClientService: PostServiceClientService,
        private readonly config: ConfigService
    ) {}

    async createPost(file) {
        const s3 = new S3Service({
            endpoint: this.config.getOrThrow('S3_ENDPOINT'),
            region: this.config.getOrThrow('S3_REGION'),
            accessKeyId: this.config.getOrThrow('S3_ACCESS_KEY_ID'),
            secretAccessKey: this.config.getOrThrow('S3_SECRET_ACCESS_KEY'),
            bucket: this.config.getOrThrow('S3_BUCKET_NAME'),
          });
        const originalName = `${Date.now()}-${file.originalname}`
        s3.upload(file.buffer, originalName,'image')
        
        return await firstValueFrom(this.postServiceClientService.createPost({content: 'string',
            mediaUrl: "string",
            mediaType: "string",
            authorId: "string",
        }))
    }
}