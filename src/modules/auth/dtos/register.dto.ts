import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { IUserCreate } from '@app/common';

export class RegisterDto implements IUserCreate {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
