import { AuthServiceClientService } from '@lib/grpc/dist/client/auth-service-client.service';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ConfirmationDto } from './dto/email-confirmation.dto';

@Injectable()
export class AuthService {
    constructor(private readonly authServiceClientService: AuthServiceClientService) { }

    async getUserById(id: string) {
        return await firstValueFrom(this.authServiceClientService.getUserById({ id: id }))
    }

    async registration(dto: RegisterDto) {
        try {
            const response = await firstValueFrom(this.authServiceClientService.registration(dto))
            return { message: "Вы успешно зарегестрировались. Подтвердите свою почту" }

        } catch (err) {
            return {
                message: [err.details],
                error: "Bad Request",
                statusCode: 400
            }
        }
    }

    async login(dto: LoginDto, req: Request) {
        try {
            const response = await firstValueFrom(this.authServiceClientService.login(dto))
            if (response.id) {
                req.session.userId = response.id;
                req.session.save(err => {
                    if (err) {
                        console.error('Ошибка сохранения сессии:', err);
                    }
                });
            } else {
                return { message: "К вам на почту был выслан код двухфайторной аунтефикации" }
            }
            return { message: 'ЛОГИН успешна СЕССИЯ ЕСТЬ' };
        } catch (err) {
            return {
                message: [err.details],
                error: "Bad Request",
                statusCode: 400
            }
        }
    }

    async emailConfirmation(req: Request, dto: ConfirmationDto) {
        try {
            const response = await firstValueFrom(this.authServiceClientService.emailConfirmation(dto))
            req.session.userId = response.id;
            req.session.save(err => {
                if (err) {
                    console.error('Ошибка сохранения сессии:', err);
                }
            });

            return { message: 'вы успешно полдтердили Логин' }
        } catch (err) {
            return err
        }
    }

    async logout(req: Request, res: Response) {
        try {
            await new Promise<void>((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        return reject(
                            new InternalServerErrorException(
                                'Не удалось завершить сессию. Возможно, возникла проблема с сервером или сессия уже была завершена.'
                            )
                        );
                    }
                    res.clearCookie('session');
                    resolve();
                });
            });


            res.status(200).json({ message: "Вы успешно вышли из системы" });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async connect(provider: string) {
        const res = await firstValueFrom(this.authServiceClientService.oauthConnect({ provider: provider }))
        return res
    }

    async callback(req: Request, provider: string, code: string, res: Response) {
        const response = await firstValueFrom(this.authServiceClientService.oauthCallback({ code: code, provider: provider }))
        try {
            req.session.userId = response.user.id;
            req.session.save(err => {
                if (err) {
                    console.error('Ошибка сохранения сессии:', err);
                }
            });
        } catch(err){
           throw new BadRequestException(err)
        }
        return response
    }

    async findProfile(userId: string) {
        const res = await firstValueFrom(this.authServiceClientService.checkProfile({id: userId}))
        return res
    }

    async passwordReset(dto: any) {
        try {
            const res = await firstValueFrom(this.authServiceClientService.passwordReset(dto))
            return res
        }catch(err) {
            return err
        }
    } 

    async passwordNew(dto,token: string) {
        try {
            const res =  await firstValueFrom(this.authServiceClientService.passwordNew({password: dto, token: token}))
            return res.bool
        }catch(err) {
            return {
                code: 404,
                message: err.details,
                statusCode: "Err"
            }
        }
    }
}