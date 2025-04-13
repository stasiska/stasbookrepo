// src/config/social-service-grpc-client.constants.ts
import { SOCIAL_SERVICE_PACKAGE_NAME } from "@lib/grpc/dist/typings/social_service";
import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import * as path from "path";
import { protoBufModulesPath } from "./protobuf-modules-path.constants";

export const socialServiceGrpcClientOptions: ClientProviderOptions = {
    name: SOCIAL_SERVICE_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
        channelOptions: {
            grpc_arg_enable_channelz: 0,
        },
        package: [SOCIAL_SERVICE_PACKAGE_NAME],
        protoPath: path.join(protoBufModulesPath, 'social_service.proto'),
        url: process.env.SOCIAL_SERVICE_URL || "localhost:55014"
    }
};