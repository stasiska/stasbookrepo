import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentPostDto, CreateMediaDto, CreatePostDto, GetPostByIdDto, GetPostByUserIdDto, LikePostDto, Media, Post, Posts, PostServiceController } from '@lib/grpc/dist/typings/post_service';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';

@GrpcService()
export class PostsController implements PostServiceController {
  constructor(private readonly postsService: PostsService) {}
  createMedia(request: CreateMediaDto): Promise<Media> | Observable<Media> | Media {
    throw new Error('Method not implemented.');
  }
  
  @GrpcMethod('PostService', "CreatePost")
  createPost(request: CreatePostDto): Promise<Post> | Observable<Post> | Post {
    return this.postsService.createPost(request);
  }

  @GrpcMethod('PostService', "GetPostById")
  getPostById(request: GetPostByIdDto): Promise<Post> | Observable<Post> | Post {
    return this.postsService.getPostById(request);
  }

  @GrpcMethod('PostService', "GetPostByUserId")
  getPostByUserId(request: GetPostByUserIdDto): Promise<Posts> | Observable<Posts> | Posts {
    return this.postsService.getPostByUserId(request);
  }

  @GrpcMethod('PostService', "LikePost")
  likePost(request: LikePostDto): Promise<Post> | Observable<Post> | Post {
    return this.postsService.likePost(request);
  }

  @GrpcMethod('PostService', "CommentPost")
  commentPost(request: CommentPostDto): Promise<Post> | Observable<Post> | Post {
    return this.postsService.commentPost(request);
  }

}
