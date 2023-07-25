import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/services/user.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  validate(email: string, password: string) {
    return this.userService.verifyUser(email, password);
  }
}
