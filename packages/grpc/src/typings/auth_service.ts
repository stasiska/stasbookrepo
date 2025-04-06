/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user_service";

export interface Boolean {
  bool: boolean;
}

export interface passwordDto {
  password: string;
  token: string;
}

export interface resetPasswordDto {
  email: string;
}

export interface oauthConnectRes {
  url: string;
}

export interface providerDto {
  provider: string;
}

export interface emailConfirmationDto {
  token: string;
}

export interface Empty {
}

export interface RegistrationDto {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export interface OauthCallbackRes {
  redirectURL: string;
  user: User | undefined;
}

export interface OauthCallbackDto {
  code: string;
  provider: string;
}

export interface LoginDto {
  email: string;
  password: string;
  code?: string | undefined;
}

export interface FindOneUserByEmailDto {
  email: string;
}

export interface FindOneUserByIdDto {
  id: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  password: string;
  picture?: string | undefined;
  role: string;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  method: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export const USER_SERVICE_PACKAGE_NAME = "user_service";

export interface AuthServiceClient {
  getUserById(request: FindOneUserByIdDto): Observable<User>;

  registration(request: RegistrationDto): Observable<User>;

  login(request: LoginDto): Observable<User>;

  oauthCallback(request: OauthCallbackDto): Observable<OauthCallbackRes>;

  oauthConnect(request: providerDto): Observable<oauthConnectRes>;

  checkProfile(request: FindOneUserByIdDto): Observable<User>;

  emailConfirmation(request: emailConfirmationDto): Observable<FindOneUserByIdDto>;

  passwordReset(request: resetPasswordDto): Observable<Boolean>;

  passwordNew(request: passwordDto): Observable<Boolean>;
}

export interface AuthServiceController {
  getUserById(request: FindOneUserByIdDto): Promise<User> | Observable<User> | User;

  registration(request: RegistrationDto): Promise<User> | Observable<User> | User;

  login(request: LoginDto): Promise<User> | Observable<User> | User;

  oauthCallback(request: OauthCallbackDto): Promise<OauthCallbackRes> | Observable<OauthCallbackRes> | OauthCallbackRes;

  oauthConnect(request: providerDto): Promise<oauthConnectRes> | Observable<oauthConnectRes> | oauthConnectRes;

  checkProfile(request: FindOneUserByIdDto): Promise<User> | Observable<User> | User;

  emailConfirmation(
    request: emailConfirmationDto,
  ): Promise<FindOneUserByIdDto> | Observable<FindOneUserByIdDto> | FindOneUserByIdDto;

  passwordReset(request: resetPasswordDto): Promise<Boolean> | Observable<Boolean> | Boolean;

  passwordNew(request: passwordDto): Promise<Boolean> | Observable<Boolean> | Boolean;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUserById",
      "registration",
      "login",
      "oauthCallback",
      "oauthConnect",
      "checkProfile",
      "emailConfirmation",
      "passwordReset",
      "passwordNew",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
