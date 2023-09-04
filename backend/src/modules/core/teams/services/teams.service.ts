import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateTeamDto,
  CreateTeamMemberDto,
  RemoveTeamMemberDto,
  TeamEntity,
} from '@app/common';
import { UserService } from '../../../user/services/user.service';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createTeam(teamDto: CreateTeamDto): Promise<TeamEntity> {
    const { authorId, teamMembers, gameId } = teamDto;

    // creating team
    const team = (await this.prisma.team.create({
      data: {
        authorId,
        gameId,
      },
    })) as TeamEntity;

    // add team id for everu team member object for createMany
    const members = teamMembers.map((member) => ({
      ...member,
      teamId: team.id,
    }));

    // creating team memberd records
    await this.prisma.teamMember.createMany({
      data: members,
    });

    return team;
  }

  // check if user is author of the game
  async checkIsUserIsAuthor(gameId: string, userId: string): Promise<boolean> {
    const team = await this.prisma.team.findFirst({
      where: {
        gameId,
      },
    });

    if (team && team.authorId === userId) return true;
    return false;
  }

  // return team by game id
  async getTeamByGameId(gameId: string) {
    return this.prisma.team.findUniqueOrThrow({
      where: {
        gameId,
      },
      include: {
        team_members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  // add user to the team
  async addUserToTheTeam(
    gameId: string,
    memberDto: CreateTeamMemberDto,
    userId: string,
  ) {
    // find team
    const team = await this.prisma.team.findFirst({
      where: { gameId },
    });

    if (!team) throw new NotFoundException('Team not found');

    // check if user is author of the game
    const check = this.checkIsUserIsAuthor(team.id, userId);

    if (!check) throw new ForbiddenException('You are not in the team');

    // find user
    const user = await this.userService.findById(memberDto.userId);

    if (!user) throw new NotFoundException('No such user');

    // add user to the team
    return this.prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: memberDto.role,
      },
    });
  }

  async removeUserFromTeam(
    gameId: string,
    dto: RemoveTeamMemberDto,
    userId: string,
  ) {
    // find team
    const team = await this.prisma.team.findFirst({
      where: { gameId },
    });

    if (!team) throw new NotFoundException('Team not found');

    // check if user is author of the game
    const check = this.checkIsUserIsAuthor(team.id, userId);

    if (!check) throw new ForbiddenException('You are not in the team');

    return this.prisma.teamMember.delete({
      where: {
        id: dto.teamMemberId,
      },
    });
  }
}
