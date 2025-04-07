import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostService } from "./post.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('post-service')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createPost(@UploadedFile() file) {
        const res = this.postService.createPost(file)
        return res
    }

    @Get()
    async aa(){
        return {messsa: "dfsdf"}
    }
}