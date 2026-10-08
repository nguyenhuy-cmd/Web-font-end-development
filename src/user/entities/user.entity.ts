
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm'; // Thêm từ khóa 'type' ở đây!
import { Post } from '../../posts/entities/post.entity.js';

export type UserDocument = User & Document;

// Dùng enum để định nghĩa các role có thể có
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema({ timestamps: true }) // timestamps: tự động thêm createdAt và updatedAt
export class User {
    @PrimaryGeneratedColumn('uuid')
    _id: string
    // Cột username
    @Prop({ required: true })
    username: string;

    // Cột email - unique để không bị trùng
    @Prop({ required: true, unique: true })
    email: string;

    // Cột password
    @Prop({ required: true })
    password: string;

    // Cột role - mặc định là 'user'
    @Prop({
        enum: UserRole,           // chỉ chấp nhận giá trị trong enum
        default: UserRole.USER    // mặc định là 'user' khi tạo mới
    })
    role: UserRole;

    @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
    posts: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

