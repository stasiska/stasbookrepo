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
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class AuthService {
    public constructor(
        @Inject(DRIZZLE) private db: DrizzleDB,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly provderSerivce: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly twoFactorAuthService: TwoFactorAuthService,
    ) { }

    
    public async register(dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if (isExists) {
            throw new RpcException("пользователь уже существует")
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


    public async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)
        if (!user || !user.password) {
            throw new RpcException('Пользователь не найден')
        }

        const isValidPassword = await verify(user.password, dto.password)

        if (!isValidPassword) {
            throw new RpcException('Неверный пароль. Пожалуйста, попробуйте еще раз или восстановите пароль, есле забыли его')
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email)
            throw new RpcException('Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес')
        }

        if (user.isTwoFactorEnabled) {
            if (!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email)

                return {
                    message: `Проверьте вашу почту. Требуется код двуйфакторной аутентификации.`
                }
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
        console.log(profile, "profile")
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
                    new InternalServerErrorException('не удалось сохранить сессию')
                }
                resolve({
                    user
                })
            })
        })
    }
}
