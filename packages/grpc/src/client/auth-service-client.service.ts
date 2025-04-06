import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AUTH_SERVICE_NAME, AuthServiceClient, Boolean, emailConfirmationDto, Empty, FindOneUserByIdDto, LoginDto, OauthCallbackDto, OauthCallbackRes, oauthConnectRes, passwordDto, providerDto, RegistrationDto, resetPasswordDto, User, USER_SERVICE_PACKAGE_NAME } from "../typings/auth_service";
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from "rxjs";

@Injectable()
export class AuthServiceClientService implements AuthServiceClient, OnModuleInit {
    private authServiceClient: AuthServiceClient;

    constructor(@Inject(USER_SERVICE_PACKAGE_NAME) private client: ClientGrpc) {}
    passwordReset(request: resetPasswordDto): Observable<Boolean> {
        return this.authServiceClient.passwordReset(request);
    }
    passwordNew(request: passwordDto): Observable<Boolean> {
        return this.authServiceClient.passwordNew(request);
    }
    emailConfirmation(request: emailConfirmationDto): Observable<FindOneUserByIdDto> {
        return this.authServiceClient.emailConfirmation(request);
    }
    registration(request: RegistrationDto): Observable<User> {
        return this.authServiceClient.registration(request);
    }
    login(request: LoginDto): Observable<User> {
        return this.authServiceClient.login(request);
    }
    oauthCallback(request: OauthCallbackDto): Observable<OauthCallbackRes> {
        return this.authServiceClient.oauthCallback(request);
    }
    oauthConnect(request: providerDto): Observable<oauthConnectRes> {
        return this.authServiceClient.oauthConnect(request);
    }
    checkProfile(request: FindOneUserByIdDto): Observable<User> {
        return this.authServiceClient.checkProfile(request);
    }

    getUserById(request: FindOneUserByIdDto): Observable<User> {
        return this.authServiceClient.getUserById(request);
    }

    onModuleInit(): void {
        this.authServiceClient = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }
}