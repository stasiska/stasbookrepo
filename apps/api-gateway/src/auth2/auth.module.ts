import { AuthServiceClientService } from "@lib/grpc/dist/client";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { authServiceGrpcClientOptions } from "src/config/auth-service-grpc-client.constants";
import { AuthService } from "./auth.service";
import { AuthContoller } from "./auth.contoller";

@Module({
    imports: [ClientsModule.register([authServiceGrpcClientOptions])],
    providers: [AuthServiceClientService, AuthService],
    controllers: [AuthContoller],
})
export class AuthModule {}