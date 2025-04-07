import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { CommentPostDto, CreateMediaDto, CreatePostDto, GetPostByIdDto, GetPostByUserIdDto, LikePostDto, Media, Post, POST_SERVICE_NAME, POST_SERVICE_PACKAGE_NAME, Posts, PostServiceClient } from "../typings/post_service";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Injectable()
export class PostServiceClientService implements PostServiceClient, OnModuleInit {
    private postServiceClient: PostServiceClient
    
    constructor(@Inject(POST_SERVICE_PACKAGE_NAME) private client: ClientGrpc) {}
    createMedia(request: CreateMediaDto): Observable<Media> {
        return this.postServiceClient.createMedia(request);
    }
    createPost(request: CreatePostDto): Observable<Post> {
        return this.postServiceClient.createPost(request); 
    }
    getPostById(request: GetPostByIdDto): Observable<Post> {
        return this.postServiceClient.getPostById(request);
    }
    getPostByUserId(request: GetPostByUserIdDto): Observable<Posts> {
        return this.postServiceClient.getPostByUserId(request);
    }
    likePost(request: LikePostDto): Observable<Post> {
        return this.postServiceClient.likePost(request);
    }
    commentPost(request: CommentPostDto): Observable<Post> {
        return this.postServiceClient.commentPost(request);
    }

    onModuleInit(): void {
        this.postServiceClient = this.client.getService<PostServiceClient>(POST_SERVICE_NAME);
    }
}