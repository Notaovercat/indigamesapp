import { Injectable } from '@nestjs/common';
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

  async checkIfUserInTeam(teamId: string, userId: string): Promise<boolean> {
    const team = await this.prisma.team.findUniqueOrThrow({
      where: {
        id: teamId,
      },
    });

    if (team.authorId === userId) return true;
    return false;
  }
}
