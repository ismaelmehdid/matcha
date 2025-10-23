import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Catch() // Catch all exceptions
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorResponse: { code: string; details: string; };
    let messageKey: string;

    if (exception instanceof CustomHttpException) {
      // Handle our custom exception
      status = exception.getStatus();
      errorResponse = {
        code: exception.code,
        details: exception.details,
      };
      messageKey = exception.messageKey;
    } else if (exception instanceof HttpException) {
      // Handle standard NestJS HTTP exceptions (including ValidationPipe errors)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Check if this is a validation error (400 Bad Request with validation messages)
      if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const messages = exceptionResponse.message;
        const validationDetails = Array.isArray(messages) ? messages.join(', ') : String(messages);

        errorResponse = {
          code: 'VALIDATION_FAILED',
          details: validationDetails,
        };
        messageKey = 'ERROR_VALIDATION_FAILED';
      } else {
        errorResponse = {
          code: HttpStatus[status], // e.g., 'NOT_FOUND'
          details: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
        };
        messageKey = `ERROR_${HttpStatus[status]}`;
      }
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: 'INTERNAL_SERVER_ERROR',
        details: 'An unexpected internal server error occurred.',
      };
      messageKey = 'ERROR_INTERNAL_SERVER';
    }

    response.status(status).json({
      success: false,
      error: errorResponse,
      messageKey: messageKey,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}