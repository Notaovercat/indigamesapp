import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';
import { PrismaService } from 'nestjs-prisma';
import { hashSync } from 'bcryptjs';
import {
  CreateGameDto,
  CreateTeamMemberDto,
  RemoveTeamMemberDto,
  UserEntity,
} from '@app/common';
import { IGame, ITeamMember } from '@workspace/shared';

describe('GenresController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

  let game: IGame;

  const newAuthor = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const creds = {
    email: newAuthor.email,
    password: newAuthor.password,
  };

  let authCookie: string;

  let gameDto: CreateGameDto = {
    title: faker.word.words(1),
    description: faker.word.words(10),
    team: [],
    platforms: [],
    tags: [],
    genres: [],
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

    await prisma.user.create({
      data: {
        ...newAuthor,
        password: hashSync(newAuthor.password, 12),
      },
    });

    const genre = await prisma.genre.create({
      data: {
        name: faker.word.words(1),
      },
    });

    const platform = await prisma.platform.create({
      data: {
        name: faker.word.words(1),
      },
    });

    gameDto.genres.push(genre.id);
    gameDto.platforms.push(platform.id);

    const { headers } = await supertest(httpServer)
      .post(`/auth/login`)
      .send(creds)
      .expect(HttpStatus.OK);

    authCookie = headers['set-cookie'];

    const { body } = await supertest(httpServer)
      .post(`/games`)
      .set('Cookie', authCookie)
      .send(gameDto)
      .expect(HttpStatus.CREATED);

    game = body;
  });

  afterAll(async () => {
    await prisma.game.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.platform.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('addUserToTheTeam', () => {
    const newUser = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    let member: ITeamMember;
    let user: UserEntity;

    it('Should add user to the team', async () => {
      user = await prisma.user.create({
        data: {
          ...newUser,
        },
      });

      const dto: CreateTeamMemberDto = {
        userId: user.id,
        role: faker.word.words(1),
      };

      const { body } = await supertest(httpServer)
        .post(`/teams/game/${game.id}`)
        .set('Cookie', authCookie)
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(body).toBeTruthy();
      expect(body.user.id).toEqual(user.id);

      member = body;
    });

    it('Should remove user from the team', async () => {
      const rmdto: RemoveTeamMemberDto = {
        teamMemberId: member.id,
      };

      const { body } = await supertest(httpServer)
        .delete(`/teams/game/${game.id}`)
        .set('Cookie', authCookie)
        .send(rmdto)
        .expect(HttpStatus.OK);

      expect(body).toBeTruthy();
      expect(body.user.id).toEqual(user.id);
    });
  });
});
