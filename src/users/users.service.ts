import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUserName(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({where: {username}});
  }

  async save (dto: CreateUserDTO) {
    await this.usersRepository.save(dto);
  }
}