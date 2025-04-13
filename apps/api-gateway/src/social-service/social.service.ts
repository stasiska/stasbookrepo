import { SocialServiceClientService } from "@lib/grpc/dist/client";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SocialSerive {
    constructor(private readonly socialServiceClientService: SocialServiceClientService,
    ) {}

    async getFriendsById(userId: string) {
        try {
            const res = await firstValueFrom(this.socialServiceClientService.getUserFriends({userId: userId}))
            return res
        } catch(err) {
            return err
        }
    }
}