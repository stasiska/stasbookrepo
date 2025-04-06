// import {
//     ArgumentsHost,
//     Catch,
//     RpcExceptionFilter,
//   } from '@nestjs/common';
//   import { RpcException } from '@nestjs/microservices';
//   import { throwError, Observable } from 'rxjs';
  
//   @Catch(RpcException)
//   export class GlobalExceptionFilter implements RpcExceptionFilter<RpcException> {
//     catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//       const error = exception.getError();
  
//       let statusCode = 500;
//       let message = 'Internal Server Error';
//       let errorCode = 'INTERNAL_ERROR';
  
//       // Если ошибка — объект, а не строка
//       if (typeof error === 'object' && error !== null) {
//         if ('statusCode' in error && 'message' in error) {
//           return throwError(() => error);
//         }
  
//         if ('code' in error && 'message' in error) {
//           return throwError(() => ({
//             statusCode: 400,
//             errorCode: error.code,
//             message: error.message,
//           }));
//         }
//       }
  
//       // Если ошибка строка — обрабатываем по содержимому
//       if (typeof error === 'string') {
//         message = error;
  
//         if (error.includes('не найден')) {
//           statusCode = 404;
//           errorCode = 'NOT_FOUND';
//         } else if (error.includes('существует')) {
//           statusCode = 409;
//           errorCode = 'ALREADY_EXISTS';
//         } else if (
//           error.includes('неверный') ||
//           error.includes('истек') ||
//           error.includes('Не был предоставлен')
//         ) {
//           statusCode = 400;
//           errorCode = 'BAD_REQUEST';
//         } else if (
//           error.includes('не авторизован') ||
//           error.includes('не подтвержден') ||
//           error.includes('Не удалось')
//         ) {
//           statusCode = 401;
//           errorCode = 'UNAUTHORIZED';
//         } else if (
//           error.includes('Недостаточно прав') ||
//           error.includes('запрещен')
//         ) {
//           statusCode = 403;
//           errorCode = 'FORBIDDEN';
//         } else if (error.includes('двухфакторной')) {
//           statusCode = 401;
//           errorCode = 'TWO_FACTOR_REQUIRED';
//         }
//       }
  
//       return throwError(() => ({
//         statusCode,
//         errorCode,
//         message,
//       }));
//     }
//   }
  