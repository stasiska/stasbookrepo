import { AuthorIdDto, CreateGroupDto, UserIdReq,  } from '@lib/grpc/dist/typings/social_service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RabbitMQService } from '@lib/queue/dist/rabbitmq.service'

@Injectable()
export class SocialService {
    public constructor(private prismaService: PrismaService,
        private  queueService: RabbitMQService
    ) {}

    async createGroup(request: CreateGroupDto) {
        
    }

    async ExistFriendOrFollow(request: UserIdReq) {
        const friends = await this.prismaService.friend.findMany({
            where: {
                requesterId: request.userId
            },
            select: {
                targetId: true
            }
        })
        const listFriend = []
        friends.map((friend) => listFriend.push(friend.targetId))

        await this.queueService.emit('social.post.created', {
            authorId: request.userId,
            userIds: listFriend
        })

        return {
            authorId: request.userId,
            userIds: listFriend
        }
    }

}
