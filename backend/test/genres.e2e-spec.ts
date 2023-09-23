import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'nestjs-prisma';
import { hashSync } from 'bcryptjs';
import { GenreEntity } from '@app/common';

describe('GenresController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

  const newUser = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const newAdmin = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const userCreds = {
    email: newUser.email,
    password: newUser.password,
  };

  const adminCreds = {
    email: newAdmin.email,
    password: newAdmin.password,
  };

  let userCookie: string;
  let adminCookie: string;

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

    httpServer = app.getHttpServer();
    prisma = app.get(PrismaService);

    await prisma.user.createMany({
      data: [
        {
          ...newUser,
          password: hashSync(newUser.password, 12),
          role: 'user',
        },
        {
          ...newAdmin,
          password: hashSync(newAdmin.password, 12),
          role: 'admin',
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.genre.deleteMany();
    await app.close();
  });

  describe('createGenre', () => {
    let genre: GenreEntity;
    it('Should create genre if user is admin', async () => {
      const resAuthAdmin = await supertest(httpServer)
        .post(`/auth/login`)
        .send(adminCreds)
        .expect(HttpStatus.OK);

      adminCookie = resAuthAdmin.headers['set-cookie'];

      const dto = { name: faker.word.words(1) };

      const { body } = await supertest(httpServer)
        .post('/genres')
        .set('Cookie', adminCookie)
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(body).toBeTruthy();
      expect(body).toHaveProperty('id');
      expect(body.name).toEqual(dto.name);

      genre = body;
    });

    it('Should throw errow if if user is not admin', async () => {
      const resAuthUser = await supertest(httpServer)
        .post(`/auth/login`)
        .send(userCreds);

      userCookie = resAuthUser.headers['set-cookie'];

      const dto = { name: faker.word.words(1) };

      await supertest(httpServer)
        .post('/genres')
        .set('Cookie', userCookie)
        .send(dto)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should update genre', async () => {
      const resAuthAdmin = await supertest(httpServer)
        .post(`/auth/login`)
        .send(adminCreds)
        .expect(HttpStatus.OK);

      adminCookie = resAuthAdmin.headers['set-cookie'];

      const dto = { name: faker.word.words(1) };

      const { body } = await supertest(httpServer)
        .patch(`/genres/${genre.id}`)
        .set('Cookie', adminCookie)
        .send(dto)
        .expect(HttpStatus.OK);

      expect(body).toBeTruthy();
      expect(body).toHaveProperty('id');
      expect(body.name).toEqual(dto.name);
    });
  });

  describe('findGenres', () => {
    it('Should find array of genres', async () => {
      await supertest(httpServer).get('/genres').expect(HttpStatus.OK);
    });
  });
});
