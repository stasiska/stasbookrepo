import { PostServiceClientService } from "@lib/grpc/dist/client";
import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { postServiceGrpcClientOptions } from "src/config/post-service-grpc-client.constants";

@Module({
    imports: [ClientsModule.register([postServiceGrpcClientOptions])],
    providers: [PostServiceClientService, PostService],
    controllers: [PostController],
})
export class PostModule {}