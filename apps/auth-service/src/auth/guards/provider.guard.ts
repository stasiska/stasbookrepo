
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ProviderService } from '../provider/provider.service';
import { GrpcNotFound } from '@lib/shared/dist';

@Injectable()
export class AuthProviderGuard implements CanActivate {
    public constructor(private readonly providerService: ProviderService){}

  public async canActivate(context: ExecutionContext) {
    
    const request = context.switchToHttp().getRequest() as Request

    const provider = request.params.provider

    const providerInstance = this.providerService.findByService(provider)

    if (!providerInstance){
        throw GrpcNotFound(
            `Провайдер "${provider}" не найден. Пожалуйста, проверьте правильность введнных данных.`
        )
    }
    return true
}
}
