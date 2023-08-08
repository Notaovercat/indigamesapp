import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCuerrentUser = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (data: undefined, context: ExecutionContext) => getCuerrentUser(context),
);
