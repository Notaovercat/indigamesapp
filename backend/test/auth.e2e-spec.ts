import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { CreateUserDto } from '../libs/common/src';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'nestjs-prisma';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authCookie: string;
  let httpServer: any;
  let prisma: PrismaService;

  const newUser: CreateUserDto = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const credentionals = {
    email: newUser.email,
    password: newUser.password,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.use(cookieParser());
    await app.init();

    prisma = app.get(PrismaService);
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('Auth', () => {
    it('Should sign up a user', async () => {
      const response = await supertest(httpServer)
        .post(`/auth/register`)
        .send(newUser)
        .expect(HttpStatus.CREATED);

      expect(response.text).toBe('Success');
    });

    it('Should login', async () => {
      const response = await supertest(httpServer)
        .post(`/auth/login`)
        .send(credentionals)
        .expect(HttpStatus.OK);

      authCookie = response.headers['set-cookie'];
    });

    it('Should throw 401 error', async () => {
      await supertest(httpServer)
        .post(`/auth/login`)
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should check if user is authed and return id', async () => {
      const { body } = await supertest(httpServer)
        .get(`/auth/check`)
        .set('Cookie', [authCookie])
        .expect(HttpStatus.OK);

      expect(body).toBeTruthy();
    });

    it('Should check if user is authed and return null', async () => {
      const { body } = await supertest(httpServer)
        .get('/auth/check')
        .expect(HttpStatus.OK);

      expect(body).toEqual({});
    });
  });
});
