import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  username: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'string', description: 'string' })
  firstName: string;

  @Prop()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  email?: string;

  @Prop()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'string', description: 'string' })
  lastName?: string;

  @Prop({ required: true })
  @IsString()
  @Length(8, 128)
  @ApiProperty({ example: 'string', description: 'string' })
  password: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const User = this as UserDocument;
  User.updatedAt = new Date();
  next();
});

UserSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
