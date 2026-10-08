import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module.js';

// 1. Sửa đường dẫn import từ comment.schema thành comment.entity
import { Comment, CommentSchema } from './entities/comment.entity.js';

// 2. Nhớ import thêm Post và PostSchema (điều chỉnh đường dẫn tới posts.entity nếu cần)
import { Post, PostSchema } from '../posts/entities/post.entity.js'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    UserModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}