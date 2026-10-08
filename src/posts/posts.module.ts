import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module.js';
import { Post, PostSchema } from './entities/post.entity.js';

@Module({
  imports: [
    // ⚠️ BẮT BUỘC phải đăng ký Schema ở đây để NestJS tạo Injection Token cho Post.name
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UserModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
