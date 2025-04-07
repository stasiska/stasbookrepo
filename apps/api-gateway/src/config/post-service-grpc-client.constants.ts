import { POST_SERVICE_PACKAGE_NAME } from '@lib/grpc/dist/typings/post_service';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import * as path from 'path';
import { protoBufModulesPath } from './protobuf-modules-path.constants';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();
//console.log(config.getOrThrow<string>('AUTH_SERVICE_URL'))
export const postServiceGrpcClientOptions: ClientProviderOptions = {
    name: POST_SERVICE_PACKAGE_NAME,
    transport: Transport.GRPC,
    options: {
        channelOptions: {
            grpc_arg_enable_channelz: 0,
        },
        package: [POST_SERVICE_PACKAGE_NAME],
        protoPath: path.join(protoBufModulesPath, 'post_service.proto'),
        url: 'localhost:55013' //почему то не могу прокинуть config.getOrThrow<string>('POST_SERVICE_URL')
    }
}