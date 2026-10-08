import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const DEFAULT_DEV_USER_ID = 'dev_user_default';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (
      (request.headers['x-user-id'] as string) ||
      request.user?.id ||
      DEFAULT_DEV_USER_ID
    );
  },
);
