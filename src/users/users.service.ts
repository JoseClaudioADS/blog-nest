import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not } from 'typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count > 0;
  }

  async existsByEmailDifferentId(email: string, id: string): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: { email, id: Not(id) },
    });
    return count > 0;
  }

  async save(dto: CreateUserDTO) {
    await this.usersRepository.save(dto);
  }
}
