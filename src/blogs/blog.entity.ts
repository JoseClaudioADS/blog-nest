import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(type => User, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
