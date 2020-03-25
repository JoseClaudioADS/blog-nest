import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USERNAME'),
          logging: configService.get('DB_LOGGING'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          //        entities: [],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
