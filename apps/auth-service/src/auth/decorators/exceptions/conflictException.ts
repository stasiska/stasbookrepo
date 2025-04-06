import { ArgumentsHost, Catch, RpcExceptionFilter, BadRequestException, ConflictException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class GlobalExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    // Если объект — возвращаем как есть
    if (typeof error === 'object') {
      return throwError(() => error);
    }

    // иначе — оборачиваем строку
    return throwError(() => ({
      statusCode: 500,
      message: error,
    }));
  }
}

