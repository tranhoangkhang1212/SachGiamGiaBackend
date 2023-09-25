import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCode, TErrorKey } from 'src/constant/exception-code';

export class RequestInvalidException extends HttpException {
  constructor(key: TErrorKey) {
    let error = ExceptionCode[key];
    if (!error) {
      error = ExceptionCode['DEFAULT_ERROR_MESSAGE'];
    }
    super(error, HttpStatus.BAD_REQUEST);
  }
}
