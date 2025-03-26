import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from '../auth.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/libs/mail/mail.service';

@Module({
  imports: [MailerModule, DrizzleModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
