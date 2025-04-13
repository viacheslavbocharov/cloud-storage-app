import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PreRegisterDto } from './dto/pre-register.dto';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('pre-register')
  async preRegister(@Body() dto: PreRegisterDto) {
    return this.authService.preRegister(dto);
  }

  @Get('verify-registration')
  async verifyRegistration(@Query('token') token: string) {
    return this.authService.verifyRegistration(token);
  }

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   return this.authService.login(loginDto);
  // }
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected(@Req() req) {
    return { message: 'You have access!', user: req.user };
  }

  // @Post('refresh')
  // async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
  //   return this.authService.refresh(refreshTokenDto);
  // }
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    return this.authService.refresh(refreshToken, res);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('logout')
  // async logout(@Req() req) {
  //   const result = await this.authService.logout(req.user.userId);
  //   console.log('📤 Logout response:', result);
  //   return result;
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.logout(req.user.userId);

    // 🍪 Удаляем refreshToken из cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });

    console.log('📤 Logout response:', result);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.userId;
    return this.authService.changePassword(userId, dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
