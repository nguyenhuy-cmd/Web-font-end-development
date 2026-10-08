import { PostsModule } from './../posts/posts.module.js';
import { PostsService } from './../posts/posts.service.js';
import { UserService } from './../user/user.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../posts/entities/post.entity.js';
import { Comment } from './entities/comment.entity.js'; // Hoặc ./schemas/comment.schema.js


@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private readonly postModule: Model<Post>
  ) { }
  async create(createCommentDto: CreateCommentDto, postId: string, userId: string) {
    const post = await this.postModule.findById(postId).exec()
    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết')
    }

    const newComment = new this.commentModel({
      content: createCommentDto.content,
      post: new Types.ObjectId(postId),
      author: new Types.ObjectId(userId), // Gắn ID người bình luận
    })
    return await newComment.save();

  }

  async findAll(current: string, limitPage: string, qs: any) {
    const page = parseInt(current) || 1;
    const defaultLimit = parseInt(limitPage) || 10;

    const skip = (page - 1) * defaultLimit;

    const whereCondition: any = {};
    // Kiểm tra nếu có truyền content trong query string
    if (qs?.content) {
      whereCondition.content = { $regex: qs.content, $options: 'i' };
    }


    const totalItem = await this.commentModel.countDocuments(whereCondition)
    const result = await this.commentModel.find(whereCondition)
      .skip(skip)
      .limit(defaultLimit)
      .sort({ _id: -1 })
      .lean()

    const totalPage = Math.ceil(totalItem / defaultLimit);

    return {
      meta: {
        current: page,
        pageSize: defaultLimit,
        pages: totalPage,
      },
    }
  }


  async findOne(id: number) {
    const exComment = await this.commentModel.findById(id)
    if(!exComment){
      throw new NotFoundException('Hiện không tìm thấy bình luận này')
    }
    return exComment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const updateComment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto)
    if(!updateComment){
      throw new NotFoundException(`Không tìm thấy bình luận`)
    }
    return updateComment;
  }

  async remove(id: number) {
    const deleteComment = await this.commentModel.findByIdAndDelete(id)
    if(deleteComment){
      throw new NotFoundException(`Không tìm thấy bình luận`)
    }
    return deleteComment;
  }
}
