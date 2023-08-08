import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from '../services/user.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UserEntity } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';

describe('User Service', () => {
  let userService: UserService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user', async () => {
    const fakeUser: UserEntity = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'user',
      password: await hash(faker.internet.password(), 12),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto = {
      username: fakeUser.username,
      email: fakeUser.email,
      password: fakeUser.password,
    } satisfies CreateUserDto;

    prisma.user.create.mockResolvedValueOnce(fakeUser);
    const user = await userService.create(userDto);
    expect(user).toEqual(fakeUser);
  });

  it('should find user by id', async () => {
    const fakeUser: UserEntity = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'user',
      password: await hash(faker.internet.password(), 12),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValueOnce(fakeUser);
    const user = await userService.findById(fakeUser.id);
    expect(user).toEqual(fakeUser);
  });

  it('should find user by email', async () => {
    const fakeUser: UserEntity = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'user',
      password: await hash(faker.internet.password(), 12),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValueOnce(fakeUser);
    const user = await userService.findByEmail(fakeUser.email);
    expect(user).toEqual(fakeUser);
  });

  it('should verify the user', async () => {
    const rawPassword = faker.internet.password();
    const hashedPassword = await hash(rawPassword, 12);

    const fakeUser: UserEntity = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'user',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto = {
      email: fakeUser.email,
      password: rawPassword,
    };

    userService.findByEmail = jest.fn().mockResolvedValue(fakeUser);

    const user = await userService.verifyUser(userDto.email, userDto.password);
    expect(user).toEqual(fakeUser);
  });

  it('should throw 401 error', async () => {
    const rawPassword = faker.internet.password();
    const hashedPassword = await hash(rawPassword, 12);

    const fakeUser: UserEntity = {
      id: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      role: 'user',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto = {
      email: fakeUser.email,
      password: 'wrong',
    };

    userService.findByEmail = jest.fn().mockResolvedValue(fakeUser);
    await expect(
      userService.verifyUser(userDto.email, userDto.password),
    ).rejects.toThrow(UnauthorizedException);
  });
});
