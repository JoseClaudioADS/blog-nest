import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
const { promisify } = require('util');
import { User } from 'src/users/user.entity';
import { BlogsService } from './blogs.service';

@Injectable()
export class BlogPolicyInterceptor implements NestInterceptor {
  private readonly POLICY_NAME = 'BLOG_POLICY';

  constructor(private readonly blogsService: BlogsService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const { id } = request.params;

    if (!id) {
      Logger.error(
        `Id not provided for the policy verification. URL: ${request.url}`,
        this.POLICY_NAME,
      );
      throw new HttpException('Id not provided', HttpStatus.BAD_REQUEST);
    }

    const user = request.user as User;

    const belongsUser = await this.blogsService.existsByIdAndUser(id, user);

    if (!belongsUser) {
      Logger.warn(
        `User (${user.id}) tried to perform an action on a resource that does not belong to him`,
        this.POLICY_NAME,
      );
      throw new HttpException(
        'This resource is not yours',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return next.handle();
  }
}
