import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PreRegisterDto } from './dto/pre-register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async preRegister(dto: PreRegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new BadRequestException('User already exists');

    const payload = { ...dto };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    await this.mailService.sendVerificationLink(dto.email, token);

    return { message: 'Verification link sent to your email' };
  }

  // async verifyRegistration(token: string) {
  //   try {
  //     const payload = this.jwtService.verify(token, {
  //       secret: this.configService.get<string>('JWT_SECRET'),
  //     });

  //     const { email, password, firstName, lastName } = payload;

  //     const exists = await this.userModel.findOne({ email });
  //     if (exists) throw new BadRequestException('User already exists');

  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     const user = await this.userModel.create({
  //       email,
  //       password: hashedPassword,
  //       firstName,
  //       lastName,
  //       role: 'user',
  //       isEmailVerified: true,
  //       refreshToken: null,
  //     });

  //     const jwtPayload = { email: user.email, sub: user._id };

  //     const accessToken = this.jwtService.sign(jwtPayload, {
  //       expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
  //     });

  //     const refreshToken = this.jwtService.sign(jwtPayload, {
  //       expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
  //     });

  //     await this.userModel.findByIdAndUpdate(user._id, {
  //       refreshToken: await bcrypt.hash(refreshToken, 10),
  //     });

  //     return { accessToken, refreshToken };
  //   } catch {
  //     throw new UnauthorizedException('Invalid or expired verification link');
  //   }
  // }

  // async login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;

  //   const user = await this.userModel.findOne({ email });
  //   if (!user || !(await bcrypt.compare(password, user.password))) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }

  //   const payload = { email: user.email, sub: user._id };

  //   const accessToken = this.jwtService.sign(payload, {
  //     expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
  //   });

  //   const refreshToken = this.jwtService.sign(payload, {
  //     expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
  //   });

  //   const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  //   await this.userModel.findByIdAndUpdate(user._id, {
  //     refreshToken: hashedRefreshToken,
  //   });

  //   return { accessToken, refreshToken };
  // }
  async verifyRegistration(token: string, res: Response) {
  try {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const { email, password, firstName, lastName } = payload;

    const exists = await this.userModel.findOne({ email });
    if (exists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      isEmailVerified: true,
      refreshToken: null,
    });

    const jwtPayload = { email: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: await bcrypt.hash(refreshToken, 10),
    });

    // Установим refreshToken в HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return { accessToken };
  } catch {
    throw new UnauthorizedException('Invalid or expired verification link');
  }
}

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;
  
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { email: user.email, sub: user._id };
  
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });
  
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefreshToken,
    });
  
    // 👇 Устанавливаем refreshToken как httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  
    // return res.json({ accessToken });
    return { accessToken }; 
  }
  

  // async refresh(refreshTokenDto: RefreshTokenDto) {
  //   const { refreshToken } = refreshTokenDto;

  //   try {
  //     const payload = this.jwtService.verify(refreshToken, {
  //       secret: this.configService.get<string>('JWT_SECRET'),
  //     });

  //     const user = await this.userModel.findById(payload.sub);
  //     if (!user || !user.refreshToken) {
  //       throw new UnauthorizedException('Refresh token not found');
  //     }

  //     const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
  //     if (!isMatch) {
  //       throw new UnauthorizedException('Invalid refresh token');
  //     }

  //     const newPayload = { email: user.email, sub: user._id };

  //     const newAccessToken = this.jwtService.sign(newPayload, {
  //       expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
  //     });

  //     const newRefreshToken = this.jwtService.sign(newPayload, {
  //       expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
  //     });

  //     const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
  //     await this.userModel.findByIdAndUpdate(user._id, {
  //       refreshToken: hashedNewRefreshToken,
  //     });

  //     return {
  //       accessToken: newAccessToken,
  //       refreshToken: newRefreshToken,
  //     };
  //   } catch (err) {
  //     throw new UnauthorizedException('Invalid or expired refresh token');
  //   }
  // }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
  
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
  
      const user = await this.userModel.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
  
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      const newPayload = { email: user.email, sub: user._id };
  
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      });
  
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      });
  
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
      await this.userModel.findByIdAndUpdate(user._id, {
        refreshToken: hashedNewRefreshToken,
      });
  
      // 🍪 Устанавливаем новый refreshToken в cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // secure: false,
        sameSite: 'strict',
        // sameSite: 'lax',
        // path: '/api/auth/refresh',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });
  
      // ✅ Возвращаем только accessToken
      return { accessToken: newAccessToken };
  
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  

  async logout(userId: string): Promise<{ message: string }> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }
  

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { oldPassword, newPassword } = dto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const payload = { sub: user._id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn:
        this.configService.get<string>('RESET_TOKEN_EXPIRATION') || '15m',
    });

    await this.mailService.sendResetPasswordEmail(email, token);

    return { message: 'Reset link has been sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userModel.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Invalid token');

      user.password = await bcrypt.hash(newPassword, 10);
      user.refreshToken = null;
      await user.save();

      return { message: 'Password has been reset successfully' };
    } catch {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
