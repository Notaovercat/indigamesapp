import { IUserCreate } from '@app/common';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto implements IUserCreate {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
