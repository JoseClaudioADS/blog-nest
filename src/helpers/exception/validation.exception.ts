import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "yup";

export class ValidationException extends HttpException {
    
    constructor(public err: ValidationError) {
      super('Validation errors', HttpStatus.BAD_REQUEST);
    }
  }