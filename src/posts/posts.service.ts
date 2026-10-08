import { UserService } from './../user/user.service.js';
import { Injectable, Post, Query } from '@nestjs/common';
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

    const newPost = await this.postsModel.create(createPostDto)
    return newPost
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

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
