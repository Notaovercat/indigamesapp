import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTeamDto, CreateTeamMemberDto, TeamEntity } from '@app/common';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async createTeam(teamDto: CreateTeamDto): Promise<TeamEntity> {
    const { authorId, teamMembers, gameId } = teamDto;

    const team = (await this.prisma.team.create({
      data: {
        authorId,
        gameId,
      },
    })) as TeamEntity;

    const members = teamMembers.map((member) => ({
      ...member,
      teamId: team.id,
    }));

    await this.prisma.teamMember.createMany({
      data: members,
    });

    return team;
  }

  async checkIsUserIsAuthor(gameId: string, userId: string): Promise<boolean> {
    console.log(gameId);
    const team = await this.prisma.team.findUniqueOrThrow({
      where: {
        gameId,
      },
    });

    if (team.authorId === userId) return true;
    return false;
  }

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

  async addUserToTheTeam(
    gameId: string,
    memberDto: CreateTeamMemberDto,
    userId: string,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { gameId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }
    const check = this.checkIsUserIsAuthor(team.id, userId);

    if (!check) throw new ForbiddenException('You are not in the team');

    return this.prisma.teamMember.create({
      data: {
        ...memberDto,
        teamId: team.id,
      },
    });
  }
}
