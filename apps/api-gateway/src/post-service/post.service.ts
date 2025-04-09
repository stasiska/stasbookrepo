import { PostServiceClientService } from '@lib/grpc/dist/client';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { S3Service } from '@lib/s3/dist/index';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import { CreatePostDto } from './dto/createPostDto';
@Injectable()
export class PostService {
    constructor(private readonly postServiceClientService: PostServiceClientService,
        private readonly config: ConfigService
    ) {}

    async createPost(file,userId: string, dto: CreatePostDto) {
        const s3 = new S3Service({
            endpoint: this.config.getOrThrow('S3_ENDPOINT'),
            region: this.config.getOrThrow('S3_REGION'),
            accessKeyId: this.config.getOrThrow('S3_ACCESS_KEY_ID'),
            secretAccessKey: this.config.getOrThrow('S3_SECRET_ACCESS_KEY'),
            bucket: this.config.getOrThrow('S3_BUCKET_NAME'),
          });
        const originalName = `${Date.now()}-${file.originalname}`
        const linkOnImage = `${this.config.getOrThrow('S3_GET_STATIC')}${originalName}`
        //s3.upload(file.buffer, originalName,'image')
        return await firstValueFrom(this.postServiceClientService.createPost({
            content: dto.content || ' ',
            mediaUrl: linkOnImage,
            mediaType: "image",
            authorId: userId,
        }))
    }


    async getPostById(postId: string) {
        try {
            const res = await firstValueFrom(this.postServiceClientService.getPostById({
                postId: postId
            })) 
            return res
        } catch(err) {
            return  {
                message: [err.details],
                error: "Not Found",
                statusCode: 404
            }
        }
    }

    async getPostsByUserId(userId: string) {
        try {
            const res = await firstValueFrom(this.postServiceClientService.getPostByUserId({
                authorId: userId
            })) 
            return res
        } catch(err) {
            return  {
                message: [err.details],
                error: "Not Found",
                statusCode: 404
            }
        }
    }

    async likePost(postId: string, userId: string) {
        try {
            const res = await firstValueFrom(this.postServiceClientService.likePost({userId: userId, postId: postId}))
            return res
        } catch(err){
            return  {
                message: [err.details],
                error: "Not Found",
                statusCode: 400
            }
        }
    }

    async commentPost(userId: string, dto){
        try {
            const res = await firstValueFrom(this.postServiceClientService.commentPost({
                userId: userId,
                postId: dto.postId,
                text: dto.text
            }))
            return res
        } catch(err) {
            return  {
                message: [err.details],
                error: "Not Found",
                statusCode: 400
            }
        }
    }
}