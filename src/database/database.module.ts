import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        logging: false, //TODO incluir process env
        password: 'docker',
        database: 'blog',
//        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
    ],
  })
export class DatabaseModule {}
