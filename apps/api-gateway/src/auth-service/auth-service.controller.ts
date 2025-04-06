import { BadRequestException, Body, Catch, ConflictException, Controller, Get, HttpException, Inject, InternalServerErrorException, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { error } from 'console';
import { Request, Response } from 'express';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constans';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfirmationDto } from './dto/email-confirmation.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Authorized } from './decorators/authorized.decorator';

@Controller('auth-service0.7')
export class AuthServiceController {
    constructor(@Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private authServiceClient: ClientProxy,
    ) { }



    @Post("registration")
    async registration(@Body() dto: RegisterDto, @Req() req: Request) {
        try {
            const response = await firstValueFrom(this.authServiceClient.send('registration', {
                dto,
                sessionID: req.sessionID
            }));

            return { message: 'Регистрация успешна подтвердите свою почту' };
        } catch (err) {
            return err
        }
    }
    //@UseGuards(AuthGuard)
    @Post("login")
    async login(@Body() dto: any, @Req() req: Request) {
        try {
            const response = await firstValueFrom(this.authServiceClient.send('login', {
                dto,
                sessionID: req.sessionID
            }))
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
            return err
        }
    }

    @Post("logout")
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
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



    @Post('email-confirmation')
    async emailConfirmation(@Req() req: Request, @Body() dto: ConfirmationDto) {

        try {
            const res = await lastValueFrom(this.authServiceClient.send('email-confirmation', { dto: dto }))
            req.session.userId = res.id;
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


    @Get('/oauth/connect/:provider')
    public async connect(@Param('provider') provider: string) {

        const res = await firstValueFrom(this.authServiceClient.send('/oauth/connect', {provider}))

        return res
    }

    @Get('/oauth/callback/:provider')
    //@UseGuards(AuthProviderGuard)
    public async callback(
      @Req() req: Request,
      @Res() res: Response,
      @Query('code') code: string,
      @Param('provider') provider: string
    ) {
      if (!code) {
        throw new BadRequestException(`Не был предоставлен код авторизации.`)
      }
      //await this.authService.extractProfileFromCode(req,provider,code)
   
      const response  = await firstValueFrom(this.authServiceClient.send('/oauth/callback', {code: code, provider: provider}))

      try {
        req.session.userId = response.user.id;
            req.session.save(err => {
                if (err) {
                    console.error('Ошибка сохранения сессии:', err);
                }
            });
      } catch(err) {
        return err
      }

      return res.redirect(response.redirectURL)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    public async findProfile(@Authorized('id') userId: string) {
        return await firstValueFrom(this.authServiceClient.send('checkProfile', userId))
    }
}
