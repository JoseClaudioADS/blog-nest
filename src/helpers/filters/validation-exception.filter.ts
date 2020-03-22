import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from '../exception/validation.exception';
import { ValidationError } from 'yup';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;

    response
      .status(status)
      .json({
        errors: exception.errors,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}