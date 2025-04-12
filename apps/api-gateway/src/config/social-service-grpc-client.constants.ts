import { SOCIAL_SERVICE_PACKAGE_NAME } from "@lib/grpc/dist/typings/social_service";
import { ConfigService } from "@nestjs/config";
import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import path from "path";
import { protoBufModulesPath } from "./protobuf-modules-path.constants";

const config = new ConfigService();

export const socialServiceGrpcClientOptions: ClientProviderOptions = {
    name: SOCIAL_SERVICE_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
        channelOptions: {
            grpc_arg_enable_channelz: 0,
        },
        package: [SOCIAL_SERVICE_PACKAGE_NAME],
        protoPath: path.join(protoBufModulesPath, 'social_service.proto'),
        url: config.get<string>('SOCIAL_SERVICE_URL')
    }
}