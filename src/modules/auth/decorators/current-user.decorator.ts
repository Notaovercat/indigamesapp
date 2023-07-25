import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';

const getCuerrentUser = (context: ExecutionContext): UserEntity => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (data: undefined, context: ExecutionContext) => getCuerrentUser(context),
);
