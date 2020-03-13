import { Controller, Get } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {

    constructor (private readonly blogService: BlogService) {

    }

    @Get()
    async findAll(): Promise<string> {

        const resp = await this.blogService.findAll();

        console.log(resp);

        return 'This action returns all cats';
    }
}
