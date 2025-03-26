import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module';
import { MailModule } from './libs/mail/mail.module';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
    isGlobal: true,
  }), DrizzleModule, AuthModule, UserModule, EmailConfirmationModule, MailModule, TwoFactorAuthModule, PasswordRecoveryModule],
 
})
export class AppModule {}
