import { Module } from '@nestjs/common';
import { BlogController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { CreatedBlogProcessor } from './job/created-blog.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    BullModule.registerQueue({
      name: 'created-blog',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [BlogController],
  providers: [BlogsService, CreatedBlogProcessor],
})
export class BlogModule {}
