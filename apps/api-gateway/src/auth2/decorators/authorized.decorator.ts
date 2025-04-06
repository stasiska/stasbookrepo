import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../types/types";


export const Authorized = createParamDecorator(
    (data: string,ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user

        return request.session.userId ? request.session.userId : null 
    } 
)