import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { MailService } from 'src/libs/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid'
import { hash } from 'argon2';
import * as schema from '../../drizzle/schema/schema';
import { and, eq } from 'drizzle-orm';
import { NewPasswordDto } from './dto/new-password.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PasswordRecoveryService {
    public constructor(@Inject(DRIZZLE) private db: DrizzleDB,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) { }

    public async resetPassword(dto: ResetPasswordDto) {
        const existingUser = await this.userService.findByEmail(dto.email)

        if (!existingUser) {
            throw new RpcException(`Пользователь не найден. Пожалуйста, проверьте введенный адрес эл почты и попробуйте снова.`)
        }

        const passwordResetToken = await this.generatePasswordResetToken(existingUser.email)
        await this.mailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

        return {
            bool: true
        }
    }


    public async newPassword(dto: NewPasswordDto, token: string) {
        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.token, token),
            eq(schema.tokens.type, 'PASSWORD_RESET')
        ))

        if (!existingToken[0]) {
            throw new RpcException(
                'Токен не найден. Пожалуйста, проверьте правильность введенного токена или запросите новый.'
            )
        }

        const hasExpired = new Date(existingToken[0].expiresIn) < new Date()

        if (hasExpired) {
            throw new RpcException(
                'Токен истек. Пожалуйста, запросите новый токен для подтверждения сброса пароля.'
            )
        }

        const existingUser = await this.userService.findByEmail(existingToken[0].email)

        if (!existingUser) {
            throw new RpcException(
                'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.'
            )
        }


        await this.db.update(schema.users).set({ [schema.users.password.name]: await hash(dto.password) }).where(eq(schema.users.id, existingUser.id))

        await this.db.delete(schema.tokens).where(and(
            eq(schema.tokens.id, existingToken[0].id),
            eq(schema.tokens.type, 'PASSWORD_RESET')
        ))

        return { bool: true}
    }

    private async generatePasswordResetToken(email: string) {
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.email, email),
            eq(schema.tokens.type, 'PASSWORD_RESET')
        ))
        if (existingToken[0] !== undefined) {
            await this.db.delete(schema.tokens).where(and(
                eq(schema.tokens.id, existingToken[0].id),
                eq(schema.tokens.type, 'PASSWORD_RESET')
            ))
        }

        const passwordResetToken = await this.db.insert(schema.tokens).values({
            email: email,
            token: token,
            expiresIn: expiresIn,
            type: 'PASSWORD_RESET'
        }).returning()
        return passwordResetToken[0];
    }

}
