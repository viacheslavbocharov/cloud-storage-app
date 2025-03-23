import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Найти пользователя по ID
  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  // Обновить пользователя
  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const updated = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    return updated;
  }

  // Удалить пользователя
  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
