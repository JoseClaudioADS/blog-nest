
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

}