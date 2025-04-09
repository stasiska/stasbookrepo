import { Injectable } from '@nestjs/common';
import { S3Service } from '@lib/s3/dist/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentPostDto, CreatePostDto, GetPostByIdDto, GetPostByUserIdDto, LikePostDto } from '@lib/grpc/dist/typings/post_service';
import { MediaType } from 'prisma/__generated__';
import { mapPost } from 'src/libs/mapper/post.mapper';
import { GrpcConflict, GrpcNotFound } from '@lib/shared/dist/index';
@Injectable()
export class PostsService {

    public constructor(private prismaService: PrismaService){}

    async createPost (request: CreatePostDto) {

        const post = await this.prismaService.post.create({
            data: {
                content: request.content,
                authorId: request.authorId,
                medias: {
                    create: [
                        {
                            url: request.mediaUrl,
                            type: MediaType.IMAGE
                        }
                    ]
                }
            },
            include: {
                medias: true
            }
        })

        return {
            id: post.id,
            content: post.content,
            media: post.medias,
            authorId: post.authorId,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            likes: [],
            comments: []
        }
    }

    async getPostById (request: GetPostByIdDto){
        const post = await this.prismaService.post.findUnique({
            where: {
                id: request.postId
            },
            include: {
                medias: true,
                likes: true,
                comments: true
            },
        })

        if (!post) {
            throw GrpcNotFound(`Post with id ${request.postId} not found`)
        }
        return mapPost(post)
    }


    async getPostByUserId(request: GetPostByUserIdDto) {
        const post = await this.prismaService.post.findUnique({
            where: {
                id: request.authorId
            },
            include: {
                medias: true,
                likes: true,
                comments: true
            },
        })

        if (!post) {
            throw GrpcNotFound(`Post with id ${request.authorId} not found`)
        }
        return {posts: [mapPost(post)]}
    }

    async likePost(request: LikePostDto) {

        const existLike = await this.prismaService.like.findFirst({
            where: {
                postId: request.postId,
                userId: request.userId
            }
        })
        if (existLike) {
            throw GrpcConflict("Вы уже лайкали ранее")
        }
        const doLike = await this.prismaService.like.create({
            data: {
                postId: request.postId,
                userId: request.userId
            }
        })
        
        const likePost = await this.prismaService.post.findUnique({
            where : {
                id: request.postId
            },
            include: {
                likes: true,
                comments: true,
                medias: true
            }
        })
        
        return mapPost(likePost);
    }

    async commentPost(request: CommentPostDto) {
        const postExist = await this.prismaService.post.findUnique({
            where: {
                id: request.postId
            }
        })
        if (!postExist) {
            throw GrpcNotFound(`Post with id ${request.postId} not found`)
        }
        await this.prismaService.comment.create({
            data: {
                userId: request.userId,
                postId: request.postId,
                text: request.text
            }
        })

        const post = await this.prismaService.post.findFirst({
            where: {
                id: request.postId
            } ,
            include: {
                comments: true,
                likes: true,
                medias: true
            }
        });

        return mapPost(post);
    }
}
