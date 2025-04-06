import * as path from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

import { AuthService } from '@lib/grpc';
import { protoBufModulesPath } from './protobuf-modules-path.constants';
import { USER_SERVICE_PACKAGE_NAME } from '@lib/grpc/dist/typings/auth_service';


export const authServiceGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: USER_SERVICE_PACKAGE_NAME,
    protoPath: path.join(protoBufModulesPath, 'auth_service.proto'),
    url: 'localhost:55011', //надо бы это через конфиг прокидывать 
  },
};
