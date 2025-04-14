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


    async addFriend(userId: string, targetId: any) {
        try {
            const res = await firstValueFrom(this.socialServiceClientService.addFriend({requesterId: userId, targetId: targetId}))
            return res
        } catch(err) {
            return err
        }
    }
}