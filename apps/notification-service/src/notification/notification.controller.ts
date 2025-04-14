import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('social.post.created')
  async handleFriendPostNotification(@Payload() data: any) {
    const { authorId, userIds} = data

    for (const userId of userIds) {
      console.log(`📢 Пользователю ${userId}: Ваш друг ${authorId} создал пост`)
    }
  }
}
