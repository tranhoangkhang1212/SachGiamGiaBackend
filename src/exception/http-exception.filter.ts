import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { IExceptionMsg } from 'src/constant/exception-code';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse() as IExceptionMsg;

    response.status(status).json({
      code: errorResponse.code,
      message: errorResponse.message,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

export class HttpExceptionCustom {
  public response;
}
