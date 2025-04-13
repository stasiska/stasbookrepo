import { SocialServiceClientService } from "@lib/grpc";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { socialServiceGrpcClientOptions } from "src/config/social-service-grpc-client.constants";
import { SocialSerive } from "./social.service";
import { SocialController } from "./social.contoller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ClientsModule.register([socialServiceGrpcClientOptions])],
    providers: [SocialServiceClientService, SocialSerive],
    controllers: [SocialController]
})

export class SocialModule {}