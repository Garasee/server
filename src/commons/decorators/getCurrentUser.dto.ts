import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest()
    return req.user
  }
)
