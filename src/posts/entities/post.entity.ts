import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ✅ Bắt buộc phải EXPORT dòng này để service có thể import PostDocument
export type PostDocument = HydratedDocument<Post>;// tự động thêm các trường và các tiện ích của mongoDB

@Schema({ timestamps: true }) 
export class Post {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  // Nhiều Posts thuộc về 1 User
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
}
export const PostSchema = SchemaFactory.createForClass(Post);