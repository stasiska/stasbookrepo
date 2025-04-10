import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Query, Req, Res, UploadedFile, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostService } from "./post.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/auth.guard";
import { Authorized } from "src/auth2/decorators/authorized.decorator";
import { CreatePostDto } from "./dto/createPostDto";

@Controller('post-service')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(AuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createPost(@UploadedFile() file,
        @Authorized('id') userId: string,
        @Body() dto: CreatePostDto
    ) {
        return this.postService.createPost(file, userId, dto)

    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id)
    }

    @Get('user/:id')
    async getPostsByUserId(@Param('id') id: string) {
        return this.postService.getPostsByUserId(id)
    }

    @UseGuards(AuthGuard)
    @Post('doLike')
    async doLike(
        @Body() dto: any,
        @Authorized('id') userId: string,
    ) {
        return this.postService.likePost(dto.postId, userId)
    }

    @UseGuards(AuthGuard)
    @Post('comment')
    async addComment(@Body() dto: any,
        @Authorized('id') userId: string
    ) {
        return this.postService.commentPost(userId, dto);
    }

    @Get()
    async getAllPosts(@Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.postService.getAllPosts(page,limit)
    }
}