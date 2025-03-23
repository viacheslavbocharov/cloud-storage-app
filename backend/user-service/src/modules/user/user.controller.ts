import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';

@UseGuards(AuthGuard('jwt')) 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req): Promise<UserDto> {
    const userId = req.user.userId
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  @Patch()
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    const userId = req.user.userId;
    const updated = await this.userService.update(userId, dto);
    if (!updated) throw new NotFoundException('User not found');

    return {
      id: updated._id.toString(),
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role,
    };
  }

  @Delete()
  async deleteProfile(@Req() req) {
    const userId = req.user.userId;
    const deleted = await this.userService.remove(userId);
    if (!deleted) throw new NotFoundException('User not found');

    return { message: 'User deleted successfully' };
  }
}

