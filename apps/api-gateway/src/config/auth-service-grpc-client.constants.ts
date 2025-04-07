import { USER_SERVICE_PACKAGE_NAME } from '@lib/grpc/dist/typings/auth_service';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { protoBufModulesPath } from './protobuf-modules-path.constants';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();
export const authServiceGrpcClientOptions: ClientProviderOptions = {
    name: USER_SERVICE_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
        channelOptions: {
            grpc_arg_enable_channelz: 0,
        },
        package: [USER_SERVICE_PACKAGE_NAME],
        protoPath: path.join(protoBufModulesPath, 'auth_service.proto'),
        url: config.get<string>('AUTH_SERVICE_URL')
    }
}