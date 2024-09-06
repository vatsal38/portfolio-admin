import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  fullName: string;

  @Prop({ required: true })
  @IsString({ message: 'Email must be a string' })
  @ApiProperty({ example: 'string@yopmail.com', description: 'string' })
  email: string;

  @Prop({ required: true })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'string', description: 'string' })
  message: string;

  @Prop()
  createdBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.pre('save', function (next) {
  const product = this as ContactDocument;
  product.updatedAt = new Date();
  next();
});

ContactSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ContactSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
