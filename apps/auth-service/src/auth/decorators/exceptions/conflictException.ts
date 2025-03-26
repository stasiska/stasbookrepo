import { ArgumentsHost, Catch, RpcExceptionFilter, BadRequestException, ConflictException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class ConflictExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const errorResponse = exception.getError();

        if (typeof errorResponse === 'object') {
            return throwError(() => errorResponse);
        }

        

        const formattedError = new ConflictException(errorResponse).getResponse();

        return throwError(() => formattedError);
    }
}
