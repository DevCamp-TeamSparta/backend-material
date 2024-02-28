import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException, ErrorDomain } from './BusinessException';

export interface ApiError {
  id: string;
  domain: ErrorDomain;
  message: string;
  timestamp: Date;
}

@Catch(Error)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    let body: ApiError;
    let status: HttpStatus;
    const stack: string =
      exception.stack || (Error.captureStackTrace(exception), exception.stack);

    if (exception instanceof BusinessException) {
      status = exception.status;
      body = {
        id: exception.id,
        domain: exception.domain,
        message: exception.message,
        timestamp: exception.timestamp,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = new BusinessException(
        'generic',
        exception.message,
        exception.message,
        exception.getStatus(),
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = new BusinessException(
        'generic',
        `Internal server error: ${exception.message}`,
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.log(stack);
    console.log(typeof stack);

    this.logger.error(
      `exception: ${JSON.stringify({
        path: request.url,
        ...body,
      })}`,
      stack,
    );

    response.status(status).json(body);
  }
}
