import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(Blog)
        private readonly blogsRepository: Repository<Blog>,
      ) {}
    
      findAll(): Promise<Blog[]> {
        return this.blogsRepository.find();
      }
}
