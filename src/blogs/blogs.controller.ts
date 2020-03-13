import { Controller, Get } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blog')
export class BlogController {

    constructor (private readonly blogsService: BlogsService) {

    }

    @Get()
    async findAll(): Promise<string> {

        const resp = await this.blogsService.findAll();

        console.log(resp);

        return 'This action returns all cats';
    }
}
