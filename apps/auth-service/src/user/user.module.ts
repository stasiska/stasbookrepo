import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DrizzleModule]
})
export class UserModule {}
