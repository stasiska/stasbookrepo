import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostService } from "./post.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/auth.guard";
import { Authorized } from "src/auth2/decorators/authorized.decorator";
import { CreatePostDto } from "./dto/createPostDto";

@Controller('post-service')
export class PostController {
    constructor(private readonly postService: PostService) {}
    
    @UseGuards(AuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createPost(@UploadedFile() file,
    @Authorized('id') userId: string,
    @Body() dto: CreatePostDto
) {
        const res = this.postService.createPost(file,userId,dto)
        return res
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        const res = this.postService.getPostById(id)
        return res
    }

    @Get('user/:id')
    async getPostsByUserId(@Param('id') id: string) {
        const res = this.postService.getPostsByUserId(id)
    }

    @UseGuards(AuthGuard)
    @Post('doLike')
    async doLike(
        @Body() dto: any,
        @Authorized('id') userId: string,
    ) {
        const res = this.postService.likePost(dto.postId, userId)
        return res
    }
}