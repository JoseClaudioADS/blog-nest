import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpCode,
  Body,
  Put,
  UseFilters,
  Param,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import * as Yup from 'yup';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { ValidationExceptionFilter } from 'src/helpers/filters/validation-exception.filter';
import { UpdateBlogDTO } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
  private readonly schemaValidationStoreUpdate = Yup.object().shape({
    name: Yup.string()
      .max(200)
      .required(),
    description: Yup.string()
      .max(500)
      .required(),
  });

  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Req() req) {
    return await this.blogsService.findAll(req.user.id);
  }

  @UseFilters(ValidationExceptionFilter)
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async store(@Body() createBlogDTO: CreateBlogDTO, @Req() req) {
    await this.schemaValidationStoreUpdate.validate(createBlogDTO, {
      abortEarly: false,
    });

    return await this.blogsService.save(createBlogDTO, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseFilters(ValidationExceptionFilter)
  async update(
    @Param('id') id: string,
    @Body() updateBlogDTO: UpdateBlogDTO,
    @Req() req,
  ) {
    const blogDb = await this.blogsService.findById(id);

    if (!blogDb) {
      throw new HttpException(
        { error: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.schemaValidationStoreUpdate.validate(updateBlogDTO, {
      abortEarly: false,
    });

    Object.assign(blogDb, updateBlogDTO);
    await this.blogsService.save(blogDb, req.user);
  }
}
