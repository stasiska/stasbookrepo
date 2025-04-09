import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB, User } from 'src/drizzle/types/drizzle';
import { UserService } from 'src/user/user.service';
import { ProviderService } from './provider/provider.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import * as schema from '../drizzle/schema/schema';
import { and, eq, sql } from 'drizzle-orm';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';
import { GrpcBadRequest, GrpcConflict, GrpcNotFound } from '@lib/shared/dist';
import { LoggerService } from '@lib/logger/dist';


@Injectable()
export class AuthService {
    public constructor(
        @Inject(DRIZZLE) private db: DrizzleDB,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly provderSerivce: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly twoFactorAuthService: TwoFactorAuthService,
        private readonly logger: LoggerService
    ) { }

    
    public async register(dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if (isExists) {
            this.logger.error(`ALREADY EXISTS`, `${{
                userId: dto.email,
                message: `USER with email ${dto.email} `,
                timeStamp: new Date().toISOString(),
            }}`, "AuthService")
            throw GrpcConflict("пользователь уже существует")
        }

        const newUser = await this.userService.create({
            displayName: dto.name,
            email: dto.email,
            password: dto.password,
            picture: '...',
            method: 'CREDENTIALS',
            isVerified: false
        })


        await this.emailConfirmationService.sendVerificationToken(newUser.email)
        return newUser
    }


    public async login(dto) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user || !user.password) {
            this.logger.error(`NOT FOUND`, `${{
                userId: dto.email,
                message: `USER with email ${dto.email} `,
                timeStamp: new Date().toISOString(),
            }}`, "AuthService")
            throw GrpcNotFound('Пользователь не найден')
        }

        const isValidPassword = await verify(user.password, dto.password)

        if (!isValidPassword) {
            throw GrpcConflict('Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, есле забыли его')
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email)
            throw GrpcBadRequest('Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес')
        }

        if (user.isTwoFactorEnabled) {
            if (!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email)

                throw GrpcBadRequest('Требуется код двухфакторной аутентификации. Проверьте почту.')
            }
            await this.twoFactorAuthService.validateTwoFactorToken(user.email, dto.code)
        }
        return user
    }

    public async extractProfileFromCode(
        provider: string,
        code: string
    ) {
        const providerInstance = this.provderSerivce.findByService(provider)
        const profile = await providerInstance.findUserByCode(code)
        const account = await this.db.select().from(schema.account).where(and(
            eq(schema.account.id, profile.id),
            eq(schema.account.provider, profile.provider)
        ))
        const existUser = await this.userService.findByEmail(profile.email);

        if (existUser) {
           
            return existUser;
        }
        const user = await this.userService.create({
            email: profile.email,
            displayName: profile.name,
            picture: '',
            method: "GOOGLE",
            password: '',
            isVerified: true
        })
        const expiresAt = new Date(Date.now() + profile.expires_at * 1000).toISOString();

        if (!account[0]) {

            await this.db.insert(schema.account).values({
                userId: user.id,
                type: 'oauth',
                provider: profile.provider,
                accessToken: profile.access_token,
                refreshToken: profile.refresh_token,
                expiresIn: expiresAt.toString()
            })
        }

        return user

    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
                        )
                    )
                }
                res.clearCookie(
                    this.configService.getOrThrow<string>('SESSION_NAME')
                )
                resolve()
            })
        })
    }

    public async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if (err) {
                    this.logger.error(`ALREADY EXISTS`, `${{
                        message: `error save session `,
                        timeStamp: new Date().toISOString(),
                    }}`, "AuthService")
                    new InternalServerErrorException('не удалось сохранить сессию')
                }
                resolve({
                    user
                })
            })
        })
    }

    public async checkProfile(userId:string) {
        const user  = await this.userService.checkProfile(userId)
        return user
    }
    
}
