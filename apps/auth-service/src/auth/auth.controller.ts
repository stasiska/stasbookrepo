import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
//import { LoginDto } from './dto/login.dto';
import { AuthProviderGuard } from './guards/provider.guard';
import { GrpcMethod, GrpcService, MessagePattern } from '@nestjs/microservices';
import { ConfirmationDto } from './email-confirmation/dto/confirmation.dto';
import { RolesGuard } from './guards/roles.guard';
import { Authorization } from './decorators/auth.decorator';
import { AuthServiceController, Boolean, emailConfirmationDto, Empty, FindOneUserByIdDto, LoginDto, OauthCallbackDto, OauthCallbackRes, oauthConnectRes, passwordDto, providerDto, RegistrationDto, resetPasswordDto, User } from '@lib/grpc/dist/typings/auth_service';
import { Observable } from 'rxjs';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { PasswordRecoveryService } from './password-recovery/password-recovery.service';
import { GrpcNotFound } from '@lib/shared/dist';

//@Controller('auth')
@GrpcService()
export class AuthController implements AuthServiceController{
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerSerivce: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @GrpcMethod('AuthService', "PasswordReset")
  passwordReset(request: resetPasswordDto): Promise<Boolean> | Observable<Boolean> | Boolean {
    const res = this.passwordRecoveryService.resetPassword(request)
    return res;
  }

  @GrpcMethod('AuthService', "PasswordNew")
  passwordNew(request: passwordDto): Promise<Boolean> | Observable<Boolean> | Boolean {
    const res = this.passwordRecoveryService.newPassword({password : request.password}, request.token);
    return res
  }
 
  @GrpcMethod('AuthService', "OauthConnect")
  oauthConnect(request: providerDto): Promise<oauthConnectRes> | Observable<oauthConnectRes> | oauthConnectRes {
    const providerInstance = this.providerSerivce.findByService(request.provider)
    return {
      url: providerInstance.getAuthUrl()
    };
  }
  
  @GrpcMethod('AuthService', "EmailConfirmation")
  emailConfirmation(request: emailConfirmationDto): Promise<FindOneUserByIdDto> {
    const userId = this.emailConfirmationService.newVerification(request)
    return userId
  }
  @GrpcMethod('AuthService', "Registration")
  registration(request: RegistrationDto): Promise<User> {
    const user = this.authService.register(request)
    return user
  }
  
  @GrpcMethod('AuthService', 'Login')
  login(request: LoginDto): Promise<User> {
    const user = this.authService.login(request)
    return user;

  }
  @GrpcMethod('AuthService', 'OauthCallback')
  async oauthCallback(request: OauthCallbackDto): Promise<OauthCallbackRes> {
    if (!request.code) {
          throw GrpcNotFound('Не был предоставлен код авторизации.')
        }

      const user = await this.authService.extractProfileFromCode(request.provider,request.code)
        return {
          redirectURL: `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`,
          user: user
        }

  }

  @GrpcMethod('AuthService', 'CheckProfile')
  async checkProfile(request: FindOneUserByIdDto): Promise<User> {
    const user = this.authService.checkProfile(request.id)
    return user
  }

  @GrpcMethod('AuthService', 'GetUserById')
  async getUserById(request: FindOneUserByIdDto): Promise<User> {
    return {
      id: request.id ,
      displayName: " string",
      email: "string",
      password: "string",
      picture: "string",
      role: "string",
      isVerified: false,
      isTwoFactorEnabled: false,
      method: "string"
  }
 //тестовый метод
  }

}


