import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';

import { CreateUserDto } from '../libs/common/src';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authCookie: string;

  const newUser: CreateUserDto = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const credentionals = {
    email: newUser.email,
    password: newUser.password,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('Should sign up user', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(HttpStatus.CREATED);

      expect(response.text).toBe('Success');
    });

    it('Should login', async () => {
      const response = await supertest(app.getHttpServer())
        .post('/auth/login')
        .send(credentionals)
        .expect(HttpStatus.CREATED);

      authCookie = response.headers['set-cookie'];
    });
  });
});
