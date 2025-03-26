import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { UserRole } from "src/drizzle/types/drizzle";

export function Authorization(...roles: UserRole[]){
    if (roles.length > 0) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(AuthGuard, RolesGuard)
        )
    }
    return applyDecorators(UseGuards(AuthGuard))
}