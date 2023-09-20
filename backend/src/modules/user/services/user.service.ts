import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UserEntity } from '@app/common';
import { PrismaService } from 'nestjs-prisma';
import { compare } from 'bcryptjs';
import { CacheService } from '../../cache/services/cache.service';

@Injectable()
export class UserService {
  constructor(
    private cacheService: CacheService,
    private prisma: PrismaService,
  ) {}

  findUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.cacheService.deleteCache('users');
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findById(id: string) {
    const user = (await this.prisma.user.findFirstOrThrow({
      where: { id },
    })) as UserEntity;

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async verifyUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (!user) throw new UnauthorizedException('Wrong email or password');

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Wrong email or password');

    return user;
  }
}
