import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { RegisterDto } from '../dtos/register.dto';
import { hash } from 'bcryptjs';
import { UserEntity } from '../../user/entities/user.entity';
import { Payload } from '@app/common';
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

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findByEmail(registerDto.email);
    if (user) throw new BadRequestException('This email already in use');

    registerDto.password = await hash(registerDto.password, 12);
    return this.userService.create(registerDto);
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
