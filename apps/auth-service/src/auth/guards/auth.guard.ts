
import { Injectable, CanActivate, ExecutionContext,} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(private readonly userService: UserService){}

  public async canActivate(context: ExecutionContext): Promise<boolean>  {
    
    const request = context.switchToHttp().getRequest() ;
    
    if (typeof request.session.userId === undefined){
        throw new RpcException('Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.')
    }

    const user = await this.userService.findById(request.session.userId)
  
    request.user = user

    return true
}
}
