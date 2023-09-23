import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UserEntity } from '@app/common';
import { UnauthorizedException } from '@nestjs/common';
import { hash, hashSync } from 'bcryptjs';
import { createMock } from '@golevelup/ts-jest';

describe('User Service', () => {
  let userService: UserService;
  let prisma: DeepMockProxy<PrismaService>;

  const fakeUser: UserEntity = {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    description: "Hi, I'm developer",
    role: 'user',
    password: hashSync(faker.internet.password(), 12),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [PrismaModule],
    })
      .useMocker(createMock)
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user', async () => {
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
    const { password, ...userWithoutPassword } = fakeUser;
    prisma.user.findFirstOrThrow.mockResolvedValueOnce(
      userWithoutPassword as UserEntity,
    );
    const user = await userService.findById(userWithoutPassword.id);
    expect(user).toEqual(userWithoutPassword);
  });

  it('should find user by email', async () => {
    prisma.user.findFirst.mockResolvedValueOnce(fakeUser);
    const user = await userService.findByEmail(fakeUser.email);
    expect(user).toEqual(fakeUser);
  });

  it('should verify the user', async () => {
    const rawPassword = faker.internet.password();
    const hashedPassword = await hash(rawPassword, 12);

    const fakeUserVerified = {
      ...fakeUser,
      password: hashedPassword,
    } as UserEntity;

    const userDto = {
      email: fakeUser.email,
      password: rawPassword,
    };

    userService.findByEmail = jest.fn().mockResolvedValue(fakeUserVerified);

    const user = await userService.verifyUser(userDto.email, userDto.password);
    expect(user).toEqual(fakeUserVerified);
  });

  it('should throw 401 error', async () => {
    const rawPassword = faker.internet.password();
    const hashedPassword = await hash(rawPassword, 12);

    const user = {
      ...fakeUser,
      password: hashedPassword,
    } as UserEntity;

    const userDto = {
      email: user.email,
      password: 'wrong',
    };

    userService.findByEmail = jest.fn().mockResolvedValue(user);
    await expect(
      userService.verifyUser(userDto.email, userDto.password),
    ).rejects.toThrow(UnauthorizedException);
  });
});
