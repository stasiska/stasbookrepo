import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { MailService } from 'src/libs/mail/mail.service';
import * as schema from '../../drizzle/schema/schema';
import { and, eq } from 'drizzle-orm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TwoFactorAuthService {
    public constructor(@Inject(DRIZZLE) private db: DrizzleDB,
    private readonly mailService: MailService
) {}
    
    public async validateTwoFactorToken(email: string, code: string){
        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.email, email),
            eq(schema.tokens.type, 'TWO_FACTOR')
        ))

        if (!existingToken[0]) {
            throw new RpcException(
                'Токен двухфакторной аутентификации не найден. Убедитесь, сто вы запрашивали токен для данного адреса электронной почты.'

            )
        }

        if (existingToken[0].token !== code) {
            throw new RpcException(`Неверный код двухфакторной аунтефикации. Пожалуйста, проверьте введенный код и попробуйте снова.`)
        }

        const hashExpired = new Date(existingToken[0].expiresIn) <new Date()

        if (hashExpired) {
            throw new RpcException(
                'Срок действия токена двухфакторной аутентификации истек. Пожалуйста, запросите новый токен.'
            )
        }

        await this.db.delete(schema.tokens).where(and(
            eq(schema.tokens.id, existingToken[0].id),
            eq(schema.tokens.type, 'TWO_FACTOR')
        ))

        return true
    }

    public async sendTwoFactorToken(email: string){
        const verificationToken = await this.generateTwoFactorToken(email)
        await this.mailService.sendTwoFactorTokenEmail(
            verificationToken.email,
            verificationToken.token
        )

        return true
    }


    private async generateTwoFactorToken(email: string) {
        const token = Math.floor(
            Math.random() * (1000000 - 100000) + 100000
        ).toString()

        const expiresIn = new Date(new Date().getTime() + 300000)

        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.email, email),
            eq(schema.tokens.type, 'TWO_FACTOR')
        ))

        if (existingToken[0]) {
            await this.db.delete(schema.tokens).where(and(
                eq(schema.tokens.id, existingToken[0].id),
                eq(schema.tokens.type, 'TWO_FACTOR')
            ))
        }

        const twoFactorToken = await this.db.insert(schema.tokens).values({
            email: email,
            token: token,
            expiresIn: expiresIn,
            type: "TWO_FACTOR"
        }).returning()
        
        return twoFactorToken[0];
    }
}
