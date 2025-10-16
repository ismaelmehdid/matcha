import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    public readonly code: string,
    public readonly details: string,
    public readonly messageKey: string,
    status: HttpStatus,
  ) {
    super(details, status);
  }
}