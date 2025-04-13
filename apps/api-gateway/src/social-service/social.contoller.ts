import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SocialSerive } from "./social.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Authorized } from "src/auth2/decorators/authorized.decorator";

@Controller('social-service')
export class SocialController {
    constructor(private readonly socialService: SocialSerive) {}

    @UseGuards(AuthGuard)
    @Get('getFriendsById')
    async getUsersById(@Authorized('id') userId: string,) {
        return this.socialService.getFriendsById(userId)
    }

    @Get()
    async hello() {
        return {message: "all work"}
    }
}