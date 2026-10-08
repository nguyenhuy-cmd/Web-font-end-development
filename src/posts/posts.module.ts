import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user/user.service.js';

@Module({
  imports: [
    // ⚠️ BẮT BUỘC phải đăng ký Schema ở đây để NestJS tạo Injection Token cho Post.name
    MongooseModule.forFeature([{ name: Post.name, schema: Post }]),
    UserService
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
