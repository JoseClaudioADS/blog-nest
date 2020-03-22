import {
  Controller,
  Get,
  Request,
  UseGuards,
  Post,
  Body,
  HttpCode,
  Res,
  HttpStatus,
  HttpException,
  Put,
  Header,
  Param,
  UseFilters,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as Yup from 'yup';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ValidationExceptionFilter } from 'src/helpers/filters/validation-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  @Header('Cache-Control', 'none')
  @HttpCode(201)
  async store(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
    const existsByEmail = await this.usersService.existsByEmail(
      createUserDTO.email,
    );
    if (existsByEmail) {
      throw new HttpException(
        { error: 'Email already used' },
        HttpStatus.BAD_REQUEST,
      );

      //Alternative
      //return res.status(HttpStatus.BAD_REQUEST).json({error: "Email already used"});
    }

    createUserDTO.password = await bcrypt.hash(createUserDTO.password, 5);

    this.usersService.save(createUserDTO);
    return 'Created';
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseFilters(ValidationExceptionFilter)
  async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    const userDb = await this.usersService.findById(id);

    if (!userDb) {
      throw new HttpException(
        { error: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const schemaValidation = Yup.object().shape({
      name: Yup.string()
        .max(200)
        .required(),
      email: Yup.string()
        .email()
        .required('Email is required'),
    });

    await schemaValidation.validate(updateUserDTO, { abortEarly: false });

    const existsByEmailDifferentId = await this.usersService.existsByEmailDifferentId(
      updateUserDTO.email,
      id,
    );

    if (existsByEmailDifferentId) {
      throw new HttpException(
        { error: 'Email already used by another account' },
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(userDb, updateUserDTO);
    await this.usersService.save(userDb);
  }
}
