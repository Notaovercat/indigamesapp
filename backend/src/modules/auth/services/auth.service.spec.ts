import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';
import { CreateUserDto, UserEntity } from '@app/common';
import { UserService } from '../../user/services/user.service';
import { hashSync } from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: DeepMocked<UserService>;

  const dto: CreateUserDto = {
    username: faker.internet.userName(),
    description: faker.person.bio(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const user: UserEntity = {
    id: faker.string.uuid(),
    username: dto.username,
    description: dto.description as string,
    email: dto.email,
    password: hashSync(dto.password, 12),
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResponse: Partial<Response> = {
    cookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600), // JWT_EXPIRES_IN
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('Should register user', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(user);

      const registeredUser = await authService.register(dto);

      expect(registeredUser).toEqual(user);
    });

    it('Should throw error', async () => {
      userService.findByEmail.mockResolvedValue(user);

      await expect(authService.register(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('Should login user and set Authentication cookie', async () => {
      userService.findById.mockResolvedValue(user);

      const response = mockResponse as Response;
      await authService.login(user, response);

      expect(response.cookie).toHaveBeenCalledWith(
        'Authentication',
        'mocked_token',
        {
          httpOnly: true,
          expires: expect.any(Date),
        },
      );
    });
  });
});
