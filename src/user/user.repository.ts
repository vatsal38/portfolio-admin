import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async createUser(
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
  ): Promise<User> {
    const newUser = new this.userModel({
      username,
      password,
      firstName,
      lastName,
      email,
    });
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
