import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserTokens {
  accessToken: string;
  refreshToken?: string;
}

export const UserTokens = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserTokens => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header with Bearer token is required');
    }
    
    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    const refreshToken = request.headers['x-refresh-token'];
    
    return {
      accessToken,
      refreshToken,
    };
  },
);
