import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, trim: true })
  content: string;  

  // Bài viết chứa bình luận này
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  // Người viết bình luận
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
