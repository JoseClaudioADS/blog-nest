import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const usersService = {
    findByEmail: async () => {
      const usuarioTeste = new User();
      usuarioTeste.name = 'Usuario teste';
      usuarioTeste.email = 'email@teste.com';
      usuarioTeste.password = await bcrypt.hash('asdasd', 5);
      usuarioTeste.id = '37c1e9d9-a0f5-4f30-85e1-082923d4bf11';
      return usuarioTeste;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return access_token after success login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'email@teste.com',
        password: 'asdasd',
      })
      .expect(200);
  });
});
