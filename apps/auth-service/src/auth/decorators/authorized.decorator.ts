import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/drizzle/types/drizzle";



export const Authorized = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as User; 

        return data ? user[data] : user;
    }
);
