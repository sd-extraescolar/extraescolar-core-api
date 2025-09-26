import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthService } from '../../infrastructure/auth/google-oauth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

  @Get('google')
  async googleAuth(@Res() res: Response): Promise<void> {
    try {
      const authUrl = this.googleOAuthService.getAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      throw new HttpException('Failed to initiate Google authentication', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (error) {
        throw new HttpException(`Google authentication error: ${error}`, HttpStatus.BAD_REQUEST);
      }

      if (!code) {
        throw new HttpException('Authorization code not provided', HttpStatus.BAD_REQUEST);
      }

      const tokens = await this.googleOAuthService.getTokensFromCode(code);
      
      // En un entorno real, aquí guardarías los tokens en la base de datos
      // asociados al usuario autenticado
      
      res.json({
        message: 'Authentication successful',
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        instructions: 'Add these tokens to your .env file:',
        envVariables: {
          GOOGLE_ACCESS_TOKEN: tokens.accessToken,
          GOOGLE_REFRESH_TOKEN: tokens.refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
