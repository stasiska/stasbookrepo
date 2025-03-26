import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthProviderGuard } from './guards/provider.guard';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { ConfirmationDto } from './email-confirmation/dto/confirmation.dto';
import { RolesGuard } from './guards/roles.guard';
import { Authorization } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerSerivce: ProviderService,
  ) {}

  @MessagePattern("registration")
  async registration(data : {dto: RegisterDto, 
    sessionID: string,
    cookies: string,
    headers: string,
    ip: string}) {
    const user = await this.authService.register(data.dto)

    //await this.redisService.saveSession(data.sessionID, user.id);

    return user
  }

 

  //@Authorization("ADMIN")
  @MessagePattern('login')
  public async login(data: {
    dto: LoginDto, 
    sessionID: string,
    cookies: string,
    headers: string,
    ip: string}) {
    const user = await this.authService.login(data.dto)
    return user;
  }

  @MessagePattern("/oauth/callback")
  public async callback(data: {code: string, provider: string}) {
    if (!data.code) {
      throw new RpcException('Не был предоставлен код авторизации.')
    }
    const user = await this.authService.extractProfileFromCode(data.provider,data.code)
    return { 
      redirectURL: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
      user: user
    }
  }


  @MessagePattern('/oauth/connect')
  public async connect(data: {provider: string}) {
    const providerInstance = this.providerSerivce.findByService(data.provider)

    return {
      url: providerInstance.getAuthUrl()
    }
    
  }


}
