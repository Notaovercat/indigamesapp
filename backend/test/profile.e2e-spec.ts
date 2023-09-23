import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'nestjs-prisma';
import { hashSync } from 'bcryptjs';
import { UserEntity } from '@app/common';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

  let user: UserEntity;

  const newAuthor = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
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

    httpServer = app.getHttpServer();
    prisma = app.get(PrismaService);

    user = await prisma.user.create({
      data: {
        ...newAuthor,
        password: hashSync(newAuthor.password, 12),
      },
    });

    await prisma.game.create({
      data: {
        title: faker.word.words(1),
        description: faker.word.words(10),
        isVisible: true,
        platforms: {
          create: {
            name: faker.word.words(1),
          },
        },
        genres: {
          create: {
            name: faker.word.words(1),
          },
        },
        team: {
          create: {
            authorId: user.id,
            team_members: {
              create: {
                userId: user.id,
                role: faker.word.words(1),
              },
            },
          },
        },
      },
    });

    await prisma.game.create({
      data: {
        title: faker.word.words(1),
        description: faker.word.words(10),
        isVisible: false,
        platforms: {
          create: {
            name: faker.word.words(1),
          },
        },
        genres: {
          create: {
            name: faker.word.words(1),
          },
        },
        team: {
          create: {
            authorId: user.id,
            team_members: {
              create: {
                userId: user.id,
                role: faker.word.words(1),
              },
            },
          },
        },
      },
    });
  });

  describe('getUserProfile', () => {
    it("Should return user's main info", async () => {
      const { body } = await supertest(httpServer)
        .get(`/profile/${user.id}`)
        .expect(HttpStatus.OK);

      expect(body.username).toEqual(user.username);
    });
  });

  describe('getUserGames', () => {
    it("Should return all user's created games", async () => {
      const { body } = await supertest(httpServer)
        .get(`/profile/${user.id}/games`)
        .query({ isYourProfile: true })
        .expect(HttpStatus.OK);

      expect(body.length).toEqual(2);
    });

    it("Should return visible user's created games", async () => {
      const { body } = await supertest(httpServer)
        .get(`/profile/${user.id}/games`)
        .query({ isYourProfile: false })
        .expect(HttpStatus.OK);

      expect(body.length).toEqual(1);
    });
  });

  describe('getUserTeams', () => {
    it("Should return all user's team roles", async () => {
      const { body } = await supertest(httpServer)
        .get(`/profile/${user.id}/teams`)
        .query({ isYourProfile: true })
        .expect(HttpStatus.OK);

      expect(body.length).toEqual(2);
    });

    it("Should return visible user's team roles", async () => {
      const { body } = await supertest(httpServer)
        .get(`/profile/${user.id}/teams`)
        .query({ isYourProfile: false })
        .expect(HttpStatus.OK);

      expect(body.length).toEqual(1);
    });
  });

  afterAll(async () => {
    await prisma.game.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });
});
