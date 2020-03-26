import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req, @Res() res: Response) {
    const token = this.authService.login(req.user);
    res.json(token).send();
  }
}
