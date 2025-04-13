import { Inject, Injectable } from '@nestjs/common';
import { S3Service } from '@lib/s3/dist/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentPostDto, CreatePostDto, GetPostByIdDto, GetPostByUserIdDto, LikePostDto, PaginationDto, Post, Posts } from '@lib/grpc/dist/typings/post_service';
import { MediaType } from 'prisma/__generated__';
import { mapManyPosts, mapPost } from 'src/libs/mapper/post.mapper';
import { GrpcConflict, GrpcNotFound } from '@lib/shared/dist/index';
import { LoggerService } from '@lib/logger/dist';
import { CacheService } from '@lib/cache/dist/cache.service';
import { firstValueFrom } from 'rxjs';
import { SocialServiceClientService } from '@lib/grpc';

@Injectable()
export class PostsService {

    public constructor(private prismaService: PrismaService,
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly sociaiServiceClient: SocialServiceClientService
){}

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

       await firstValueFrom(this.sociaiServiceClient.getUserFriends({userId: request.authorId}))
        
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

        const postFromCache: Post = await this.cacheService.get(request.postId)
        if (postFromCache) {
            console.log('hello from redis')
            return postFromCache;
        }
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
            this.logger.error(`Post with id ${request.postId} not found`, ' ', "PostService")
            throw GrpcNotFound(`Post with id ${request.postId} not found`)
        }
        const cachedPost = await this.cacheService.set(request.postId, JSON.stringify(mapPost(post)))
        return mapPost(post)
    }


    async getPostByUserId(request: GetPostByUserIdDto) {
        console.log(request)
        const post = await this.prismaService.post.findMany({
            where: {
                authorId: request.authorId
            },
            include: {
                medias: true,
                likes: true,
                comments: true
            },
        })

        if (!post) {
            this.logger.error(`NOT FOUND`, `${{
                userId: request.authorId,
                message: `Post with id ${request.authorId} not found`,
                timeStamp: new Date().toISOString(),
            }}`, "PostService")
            throw GrpcNotFound(`Post with id ${request.authorId} not found`)
        }
        return {posts: mapManyPosts(post)}
    }

    async likePost(request: LikePostDto) {

        const existLike = await this.prismaService.like.findFirst({
            where: {
                postId: request.postId,
                userId: request.userId
            }
        })
        if (existLike) {
            const deleteLike = await this.prismaService.like.delete({
                where: {
                    id: existLike.id
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

            return mapPost(likePost)
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
            this.logger.error(`GET fetch failed`, `${{
                postId: request.postId,
                message: `Post with id ${request.postId} not found`,
                timeStamp: new Date().toISOString(),
            }}`, "PostService")
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
                medias: true,
            }
        });

        return mapPost(post);
    }

    async getAllPosts(request: PaginationDto) {
        
        const cachedPosts: Post[] =  await this.cacheService.get('listFirstPosts')
        
        if (cachedPosts) {
            return {posts: cachedPosts}
        }
 
        const posts = await this.prismaService.post.findMany({
            skip: (request.page - 1) * request.size,
            take: request.size,
            include: {
                comments: true,
                likes: true,
                medias: true,
            }
        })
        const mappedPosts = mapManyPosts(posts)
        await this.cacheService.addListFirstPosts(JSON.stringify(mappedPosts))
        return {posts: mapManyPosts(posts)}
    }
}
