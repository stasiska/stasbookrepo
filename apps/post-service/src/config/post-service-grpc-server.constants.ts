import * as path from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

import { protoBufModulesPath } from './protobuf-modules-path.constants';
import { POST_SERVICE_PACKAGE_NAME } from '@lib/grpc/dist/typings/post_service';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export const postServiceGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: POST_SERVICE_PACKAGE_NAME,
    protoPath: path.join(protoBufModulesPath, 'post_service.proto'),
    url: config.getOrThrow('POST_SERVICE_URL'), 
  },
};
