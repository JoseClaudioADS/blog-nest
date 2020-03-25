import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { CreateBlogDTO } from './dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    @InjectQueue('created-blog') private createdBlogQueue: Queue,
  ) {}

  findById(id: string): Promise<Blog> {
    return this.blogsRepository.findOne(id);
  }

  findAll(user: User): Promise<Blog[]> {
    return this.blogsRepository.find({ where: { user } });
  }

  findAllWithoutUser(): Promise<Blog[]> {
    return this.blogsRepository.find();
  }

  async existsByIdAndUser(id: string, user: User): Promise<boolean> {
    const count = await this.blogsRepository.count({ where: { id, user } });
    return count > 0;
  }

  async save(dto: CreateBlogDTO, user: User): Promise<Blog> {
    const entity = await this.blogsRepository.save({ ...dto, user });
    await this.createdBlogQueue.add(entity);
    return entity;
  }

  delete(id: string): Promise<DeleteResult> {
    return this.blogsRepository.delete(id);
  }
}
