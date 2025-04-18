import { AuthorIdDto, CreateGroupDto, FriendDto, UserIdReq,  } from '@lib/grpc/dist/typings/social_service';
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
                accepted: true,
                OR: [
                    { requesterId: request.userId },
                    { targetId: request.userId }
                ]
            },
            select: {
                requesterId: true,
                targetId: true
            }
        })
        const listFriend = []
        friends.map((friend) => friend.requesterId === request.userId ?
            listFriend.push(friend.targetId) : listFriend.push(friend.requesterId)
        )
        await this.queueService.emit('social.post.created', {
            authorId: request.userId,
            userIds: listFriend
        })

        return {
            authorId: request.userId,
            userIds: listFriend
        }
    }


    async addFriend(request: FriendDto) {
        await this.prismaService.friend.create({
            data: {
                requesterId: request.requesterId,
                targetId: request.targetId
            }
        })

        return {status: '200'}
    }

    async removeFriend(request: FriendDto) {
        await this.prismaService.friend.deleteMany({
            where: {
              requesterId: request.requesterId,
              targetId: request.targetId,
            },
          });
        return {status: '200'}
    }
}
