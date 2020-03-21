import { Controller, Get, Request, UseGuards, Post, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  @HttpCode(201)
  async store (@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {

    const existsByEmail = await this.usersService.existsByEmail(createUserDTO.email);
    if (existsByEmail) {

      return res.status(HttpStatus.BAD_REQUEST).json({error: "Email already used"});
    }

    createUserDTO.password = await bcrypt.hash(createUserDTO.password, 5);

    this.usersService.save(createUserDTO);
    return "Created";
  }
}
