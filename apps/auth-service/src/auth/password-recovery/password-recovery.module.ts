import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/libs/mail/mail.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, MailService, UserService],
  imports: [DrizzleModule]
})
export class PasswordRecoveryModule {}
