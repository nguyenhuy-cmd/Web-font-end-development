import { UserService } from './../user/user.service.js';
import { Injectable, NotFoundException, Post, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { PostsModule } from './posts.module.js';
import { Model } from 'mongoose';
import { PostDocument } from './entities/post.entity.js';
import { title } from 'process';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostDocument>,

    private readonly userService: UserService
  ){} 
  async create(createPostDto: CreatePostDto) {

    const exUser = await this.userService.findOne(createPostDto.authorId)

    return await this.postsModel.create(createPostDto)
  }

  async findAll(current: string, limitPage: string, qs: any) {
    const page = parseInt(current) || 1;
    const defaultLimit = parseInt(limitPage) || 10;

    const skip = (page - 1) * defaultLimit;

    const whereCondition: any = {}
    if(qs?.title){
      whereCondition.title = { $regex: title, $options: 'i' }
    }

    const totalItem = await this.postsModel.countDocuments(whereCondition)
    const result = await this.postsModel.find(whereCondition)
    .skip(skip)
    .limit(defaultLimit)
    .sort({_id: -1})
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
    const exPost = await this.postsModel.findById(id)
    if(!exPost){
      throw new NotFoundException('Hiện không tìm thấy bài viết này')
    }
    return exPost
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const updatePost = await this.postsModel.findByIdAndUpdate(id, updatePostDto)
    if(!updatePost){
      throw new NotFoundException(`Không tìm thấy bài viết`)
    }
    return updatePost;
  }

  async remove(id: number) {
    const deletePost = await this.postsModel.findByIdAndDelete(id).exec()
    if(!deletePost){
      throw new NotFoundException('Không tìm thấy bài viết')
    }
    return deletePost;
  }
}
