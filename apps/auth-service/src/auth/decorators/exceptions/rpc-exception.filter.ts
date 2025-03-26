import { ArgumentsHost, Catch, RpcExceptionFilter, BadRequestException, ConflictException, NotFoundException, UnauthorizedException, InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class GlobalExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const errorResponse = exception.getError();

        if (typeof errorResponse === 'object') {
            return throwError(() => errorResponse);
        }

        // const formattedError = new BadRequestException(errorResponse).getResponse();
        let formattedError
        if (errorResponse.includes('существует')){
            formattedError = new ConflictException(errorResponse)
        }else if (errorResponse.includes('не найден')) {
            formattedError = new NotFoundException(errorResponse)
        } else if (errorResponse.includes('неверный')
            || (errorResponse.includes('Не был предоставлен'))
            || (errorResponse.includes('Не был предоставлен')) 
            || (errorResponse.includes('истек'))) {
            formattedError = new BadRequestException(errorResponse)
        } else if (errorResponse.includes('не подтвержден') 
            || (errorResponse.includes('не авторизован'))
            || (errorResponse.includes('Не удалось'))
        )  {
            formattedError = new UnauthorizedException(errorResponse)
        } else if (errorResponse.includes('Недостаточно прав')
            || (errorResponse.includes('Пользователь не авторизован'))
        ) {
            formattedError = new ForbiddenException(errorResponse)
        }
         else {
            formattedError = new InternalServerErrorException(`errorResponse`)
        } 
        return throwError(() => formattedError.getResponse());
    }
}
