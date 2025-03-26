import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { MailService } from 'src/libs/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dto';
import * as schema from '../../drizzle/schema/schema';
import { and, eq } from 'drizzle-orm';
import {v4 as uuidv4}from 'uuid'
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class EmailConfirmationService {
    public constructor(@Inject(DRIZZLE) private db: DrizzleDB,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { }

    public async newVerification(dto: ConfirmationDto) {
        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.token, dto.token),
            eq(schema.tokens.type, "VERIFICATION")
        ))


        if (!existingToken[0]) {
            throw new RpcException(
                'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
            )
        }

        const hasExpired = new Date(existingToken[0].expiresIn) < new Date()


        if (hasExpired) {
            throw new RpcException(
                'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения.'
            )
        }

        const existingUser = await this.userService.findByEmail(existingToken[0].email)
        
        if (!existingUser) {
            throw new RpcException(
                'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.'
            )
        }


        await this.db.update(schema.users).set({ [schema.users.isVerified.name]: true }).where(eq(schema.users.id, existingUser.id))
        

        await this.db.delete(schema.tokens).where(and(
            eq(schema.tokens.id, existingToken[0].id),
            eq(schema.tokens.type,'VERIFICATION')
        ))
    
        return existingUser.id
    }

    public async sendVerificationToken(email: string) {
        const verificationToken = await this.generateVerificationToken(email)
        await this.mailService.sendConfirmationEmail(
            verificationToken[0].email,
            verificationToken[0].token
        )
        return true
    }


    private async generateVerificationToken(email: string){
        const token = uuidv4()
        const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

        const existingToken = await this.db.select().from(schema.tokens).where(and(
            eq(schema.tokens.email, email),
            eq(schema.tokens.type, 'VERIFICATION')
        ))

        if (existingToken[0]) {
            await this.db.delete(schema.tokens).where(eq(schema.tokens.id, existingToken[0].id))
        }

        const verificationToken = await this.db.insert(schema.tokens).values({email:email,
            token: token, 
            expiresIn: expiresIn, 
            type: 'VERIFICATION'
        }).returning()

        return verificationToken
    }
}
