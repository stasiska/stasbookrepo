
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/drizzle/types/drizzle';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector){}

  public async canActivate(context: ExecutionContext): Promise<boolean>  {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
    ])
    const request = context.switchToHttp().getRequest();
    if (!roles) return true

    if (!roles.includes(request.user.role)){
        throw new RpcException('Недостаточно прав. У вас нет прав доступа к этому ресурсу.')
    }
    return true
  }
}
