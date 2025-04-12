import * as path from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

import { protoBufModulesPath } from './protobuf-modules-path.constants';
import { SOCIAL_SERVICE_PACKAGE_NAME } from '@lib/grpc/dist/typings/social_service';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export const socialServiceGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: SOCIAL_SERVICE_PACKAGE_NAME,
    protoPath: path.join(protoBufModulesPath, 'social_service.proto'),
    url: config.getOrThrow('SOCIAL_SERVICE_URL'), 
  },
};
