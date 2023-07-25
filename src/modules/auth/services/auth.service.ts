import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { hash } from 'bcryptjs';
import { CreateUserDto, Payload, UserEntity } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) throw new BadRequestException('This email already in use');

    createUserDto.password = await hash(createUserDto.password, 12);
    return this.userService.create(createUserDto);
  }

  async login(user: UserEntity, response: Response) {
    const tokenPaylaod: Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const jwt_expire = this.configService.get<number>('JWT_EXPIRES_IN') || 3600;

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + jwt_expire);

    const token = this.jwtService.sign(tokenPaylaod);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
