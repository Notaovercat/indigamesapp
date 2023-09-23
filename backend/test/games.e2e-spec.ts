import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import {
  ChangeVisibilityDto,
  CreateGameDto,
  CreateUserDto,
  UpdateGameDto,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'nestjs-prisma';
import { IGame, IImage } from '@workspace/shared';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { unlink } from 'fs/promises';

describe('GamesControlles (e2e)', () => {
  let app: NestExpressApplication;
  let authCookie: string;
  let prisma: PrismaService;
  let httpServer: any;

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
    app.useStaticAssets(join(process.cwd(), 'uploads'));
    await app.init();

    httpServer = app.getHttpServer();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.game.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.platform.deleteMany();
    await app.close();
  });

  describe('Auth', () => {
    it('Should auth a user', async () => {
      await supertest(httpServer)
        .post('/auth/register')
        .send(newUser)
        .expect(HttpStatus.CREATED);

      const { headers } = await supertest(httpServer)
        .post(`/auth/login`)
        .send(credentionals)
        .expect(HttpStatus.OK);

      authCookie = headers['set-cookie'];
    });
  });

  describe('Games', () => {
    let game: IGame;
    const dto: CreateGameDto = {
      title: faker.word.words(1),
      description: faker.word.words(10),
      team: [],
      platforms: [],
      genres: [],
      tags: [faker.word.words(1), faker.word.words(1)],
    };

    describe('createGame', () => {
      it('Should create a new game', async () => {
        const platform = await prisma.platform.create({
          data: { name: faker.word.words(1) },
        });
        const genre = await prisma.genre.create({
          data: { name: faker.word.words(1) },
        });

        dto.platforms.push(platform.id);
        dto.genres.push(genre.id);

        const { body } = await supertest(app.getHttpServer())
          .post('/games/')
          .set('Cookie', [authCookie])
          .send(dto)
          .expect(HttpStatus.CREATED);

        expect(body).toBeTruthy();
        expect(body.title).toContain(dto.title);
        expect(body.description).toContain(dto.description);
        expect(body.team).not.toBeNull();
        expect(body.platforms).not.toBeNull();
        expect(body.genres).not.toBeNull();
        expect(body.tags).not.toBeNull();

        game = body;
      });

      it('Should throw 401 error', async () => {
        await supertest(app.getHttpServer())
          .post('/games/')
          .send({})
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('getAllGames', () => {
      it('Should return a array of games', async () => {
        const { body } = await supertest(httpServer)
          .get('/games/')
          .expect(HttpStatus.OK);

        expect(body).toBeTruthy();
      });

      it('Should return a array of games with qury params', async () => {
        const genre1 = await prisma.genre.create({
          data: { name: faker.word.words(1) },
        });

        const genre2 = await prisma.genre.create({
          data: { name: faker.word.words(1) },
        });

        for (let i = 0; i <= 3; i++) {
          const game = {
            id: faker.string.uuid(),
            title: faker.word.words(1),
            description: faker.word.words(5),
            rating: 0,
            views_count: 0,
            isFeatured: false,
            isVisible: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await prisma.game.create({
            data: {
              ...game,
              genres: {
                connect: {
                  id: genre1.id,
                },
              },
            },
          });
        }

        for (let i = 0; i <= 2; i++) {
          const game = {
            id: faker.string.uuid(),
            title: faker.word.words(1),
            description: faker.word.words(5),
            rating: 0,
            views_count: 0,
            isFeatured: false,
            isVisible: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await prisma.game.create({
            data: {
              ...game,
              genres: {
                connect: {
                  id: genre2.id,
                },
              },
            },
          });
        }

        const res1 = await supertest(httpServer)
          .get('/games/')
          .query({ genre: genre1.name })
          .expect(HttpStatus.OK);

        const res2 = await supertest(httpServer)
          .get('/games/')
          .query({ genre: genre2.name })
          .expect(HttpStatus.OK);

        expect(res1.body).toBeTruthy();
        expect(res1.body.length).toBe(4);

        expect(res2.body).toBeTruthy();
        expect(res2.body.length).toBe(3);
      });
    });

    describe('getMyGames', () => {
      it('Should return games created by user', async () => {
        const { body } = await supertest(httpServer)
          .get('/games/my/')
          .set('Cookie', [authCookie])
          .expect(HttpStatus.OK);

        expect(body).toBeTruthy();
      });

      it('Should throw 401 error', async () => {
        await supertest(httpServer)
          .get('/games/my/')
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('getMyGameById', () => {
      it('Should return one game created by user', async () => {
        const { body } = await supertest(httpServer)
          .get(`/games/my/${game.id}`)
          .set('Cookie', [authCookie])
          .expect(HttpStatus.OK);

        expect(body).toBeTruthy();
        expect(body.id).toEqual(game.id);
      });

      it('Should 401 error', async () => {
        await supertest(httpServer)
          .get(`/games/my/${game.id}`)
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('changeVisibility', () => {
      it('Should change visibility of the game', async () => {
        const visibilitydto: ChangeVisibilityDto = {
          gameId: game.id,
          isVisible: true,
        };

        const { body } = await supertest(httpServer)
          .patch(`/games/visible`)
          .set('Cookie', [authCookie])
          .send(visibilitydto)
          .expect(HttpStatus.OK);

        expect(body.isVisible).toEqual(visibilitydto.isVisible);
      });
    });

    describe('getGameById', () => {
      it('Should return visible game by id', async () => {
        const { body } = await supertest(httpServer)
          .get(`/games/${game.id}/`)
          .set('Cookie', [authCookie])
          .expect(HttpStatus.OK);

        expect(body).toBeTruthy();
        expect(body.isVisible).toEqual(true);
      });
    });

    describe('updateGame', () => {
      it('Should upgate the game', async () => {
        const platform = await prisma.platform.create({
          data: { name: faker.word.words(1) },
        });
        const genre = await prisma.genre.create({
          data: { name: faker.word.words(1) },
        });

        const updateDto: UpdateGameDto = {
          title: faker.word.words(1),
          description: faker.word.words(10),
          platforms: [platform.id],
          genres: [genre.id],
          tags: [faker.word.words(1), faker.word.words(1)],
        };

        const { body } = await supertest(httpServer)
          .patch(`/games/${game.id}`)
          .set('Cookie', [authCookie])
          .send(updateDto)
          .expect(HttpStatus.OK);

        expect(body).toBeTruthy();
        expect(body.title).toContain(updateDto.title);
        expect(body.description).toContain(updateDto.description);
        expect(body.team).not.toBeNull();
        expect(body.platforms).not.toBeNull();
        expect(body.genres).not.toBeNull();
        expect(body.tags).not.toBeNull();
      });
    });

    describe('rateGame', () => {
      it('Should rate the game', async () => {
        const { text } = await supertest(httpServer)
          .patch(`/games/${game.id}/rating`)
          .set('Cookie', [authCookie])
          .send({ rating: 5 })
          .expect(HttpStatus.OK);

        expect(+text).toEqual(5);
      });

      it('Should change ratin of the game', async () => {
        const { text } = await supertest(httpServer)
          .patch(`/games/${game.id}/rating`)
          .set('Cookie', [authCookie])
          .send({ rating: 2 })
          .expect(HttpStatus.OK);

        expect(+text).toEqual(2);
      });
    });

    describe('uploadCover', () => {
      it('Should upload cover image to the game', async () => {
        const { body } = await supertest(httpServer)
          .patch(`/games/${game.id}/cover/`)
          .set('Cookie', [authCookie])
          .attach('cover', `${process.cwd()}/test/images/cover.png`)
          .expect(HttpStatus.OK);

        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
      });

      it('Should replace existing cover image to the game', async () => {
        const { body } = await supertest(httpServer)
          .patch(`/games/${game.id}/cover/`)
          .set('Cookie', [authCookie])
          .attach('cover', `${process.cwd()}/test/images/cover2.png`)
          .expect(HttpStatus.OK);

        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');

        await unlink(`${process.cwd()}/uploads/images/${body.name}`);
      });
    });

    describe('uploadScreenshot', () => {
      let screen: IImage;
      it('Should upload screenshot to the game', async () => {
        const { body } = await supertest(httpServer)
          .patch(`/games/${game.id}/screenshot/`)
          .set('Cookie', [authCookie])
          .attach('screenshot', `${process.cwd()}/test/images/screen.png`)
          .expect(HttpStatus.OK);

        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');

        screen = body;
      });

      it('Should delete screenshot', async () => {
        const { body } = await supertest(httpServer)
          .delete(`/games/${game.id}/screenshot/${screen.id}`)
          .set('Cookie', [authCookie])
          .expect(HttpStatus.OK);

        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
      });
    });
  });
});
