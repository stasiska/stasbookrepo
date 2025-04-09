import { RpcException } from '@nestjs/microservices';

export function GrpcBadRequest(message: string) {
  return new RpcException({ statusCode: 400, message });
}

export function GrpcNotFound(message: string) {
  return new RpcException({ statusCode: 404, message });
}

export function GrpcConflict(message: string) {
  return new RpcException({ statusCode: 409, message });
}

export function GrpcNotUnauthorized(message: string) {
  return new RpcException({ statusCode: 401, message });
}

export function GrpcForbidden(message: string) {
  return new RpcException({ statusCode: 403, message });
}

export function GrpcRequestTimeOut(message: string) {
  return new RpcException({ statusCode: 408, message });
}