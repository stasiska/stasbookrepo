import {
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcExceptionFilter } from '@nestjs/common';
import { throwError, Observable } from 'rxjs';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger('GrpcExceptionFilter');

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();

    const formattedError = typeof error === 'object'
      ? error
      : { message: error };

    // логируем в консоль
    this.logger.error(`gRPC Error: ${JSON.stringify(formattedError)}`);

    return throwError(() => formattedError);
  }
}
