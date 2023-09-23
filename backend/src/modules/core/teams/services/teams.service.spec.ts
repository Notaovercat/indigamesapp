import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { TeamsService } from './teams.service';
import { UserService } from '../../../user/services/user.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTeamDto,
  CreateTeamMemberDto,
  RemoveTeamMemberDto,
  TeamEntity,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { TeamMember, User } from '@prisma/client';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let userService: DeepMocked<UserService>;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: UserService, useValue: createMock<UserService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    teamsService = module.get(TeamsService);
    userService = module.get(UserService);
    prismaMock = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(teamsService).toBeDefined();
  });

  describe('createTeam', () => {
    it('Should create a team', async () => {
      const dto: CreateTeamDto = {
        authorId: faker.string.uuid(),
        teamMembers: [
          {
            role: faker.word.words(),
            userId: faker.string.uuid(),
          },
          {
            role: faker.word.words(),
            userId: faker.string.uuid(),
          },
        ],
        gameId: faker.string.uuid(),
      };

      const team: TeamEntity = {
        id: faker.string.uuid(),
        authorId: dto.authorId,
        gameId: dto.gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const teamMembers = [
        {
          teamId: team.id,
          userId: dto.teamMembers[0].userId,
          role: dto.teamMembers[0].role,
        },
        {
          teamId: team.id,
          userId: dto.teamMembers[1].userId,
          role: dto.teamMembers[1].role,
        },
      ];

      prismaMock.team.create.mockResolvedValue(team);

      const crManyMock = jest.spyOn(prismaMock.teamMember, 'createMany');

      crManyMock.mockResolvedValue({
        count: teamMembers.length,
      });

      const createdTeam = await teamsService.createTeam(dto);

      expect(createdTeam).toBe(team);
      expect(crManyMock).toHaveBeenCalledWith({ data: teamMembers });
    });
  });

  describe('checkIsUserIsAuthor', () => {
    it('Should retrun true', async () => {
      const gameId = faker.string.uuid();
      const userId = faker.string.uuid();

      const team: TeamEntity = {
        id: faker.string.uuid(),
        authorId: userId,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.team.findFirst.mockResolvedValue(team);

      const isAuthor = await teamsService.checkIsUserIsAuthor(gameId, userId);

      expect(isAuthor).toBe(true);
    });

    it('Should retrun false', async () => {
      const gameId = faker.string.uuid();
      const userId = faker.string.uuid();

      const team: TeamEntity = {
        id: faker.string.uuid(),
        authorId: faker.string.uuid(),
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.team.findFirst.mockResolvedValue(team);

      const isAuthor = await teamsService.checkIsUserIsAuthor(gameId, userId);

      expect(isAuthor).toBe(false);
    });
  });

  describe('addUserToTheTeam', () => {
    it('Should add user to the team', async () => {
      // input
      const gameId = faker.string.uuid();
      const dto: CreateTeamMemberDto = {
        userId: faker.string.uuid(),
        role: faker.word.words(),
      };
      const authorId = faker.string.uuid();

      // mocked results
      const user: User = {
        id: dto.userId,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        description: null,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const team: TeamEntity = {
        id: faker.string.uuid(),
        authorId,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const teamMember: TeamMember = {
        id: faker.string.uuid(),
        teamId: team.id,
        userId: user.id,
        role: dto.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // result
      // const teamMemberRes: ITeamMember = {
      //   id: teamMember.id,
      //   user: {
      //     id: user.id,
      //     username: user.username,
      //     email: user.email,
      //   },
      //   role: dto.role,
      // };

      prismaMock.team.findFirst.mockResolvedValue(team);

      jest.spyOn(teamsService, 'checkIsUserIsAuthor').mockResolvedValue(true);

      userService.findById.mockResolvedValue(user);

      prismaMock.teamMember.create.mockResolvedValue(teamMember);

      const createdMember = await teamsService.addUserToTheTeam(
        gameId,
        dto,
        authorId,
      );

      expect(createdMember).toBe(teamMember);
    });
  });

  describe('removeUserFromTeam', () => {
    it('Should delete user from the team', async () => {
      const gameId = faker.string.uuid();
      const dto: RemoveTeamMemberDto = {
        teamMemberId: faker.string.uuid(),
      };
      const authorId = faker.string.uuid();

      const team: TeamEntity = {
        id: faker.string.uuid(),
        authorId,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const teamMember: TeamMember = {
        id: dto.teamMemberId,
        teamId: team.id,
        userId: faker.string.uuid(),
        role: faker.word.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.team.findFirst.mockResolvedValue(team);
      prismaMock.teamMember.delete.mockResolvedValue(teamMember);

      jest.spyOn(teamsService, 'checkIsUserIsAuthor').mockResolvedValue(true);

      const deletedMember = await teamsService.removeUserFromTeam(
        gameId,
        dto,
        authorId,
      );

      expect(deletedMember).toBe(teamMember);
    });
  });
});
