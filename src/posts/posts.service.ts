import { UserService } from './../user/user.service.js';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, type PostDocument } from './entities/post.entity.js';
import { UserRole } from '../user/entities/user.entity.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostDocument>,

    private readonly userService: UserService
  ){} 
  async create(createPostDto: CreatePostDto) {

    await this.userService.findOne(createPostDto.authorId)

    return await this.postsModel.create({
      title: createPostDto.title,
      content: createPostDto.content,
      author: createPostDto.authorId,
    })
  }

  async findAll(current: string, limitPage: string, qs: any) {
    const page = parseInt(current) || 1;
    const defaultLimit = parseInt(limitPage) || 10;

    const skip = (page - 1) * defaultLimit;

    if (typeof qs === 'string') {
      try { qs = JSON.parse(qs) } catch { qs = {} }
    }

    const whereCondition: any = {}
    if(qs?.title){
      whereCondition.title = { $regex: qs.title, $options: 'i' }
    }
    if(qs?.author){
      whereCondition.author = qs.author
    }

    const totalItem = await this.postsModel.countDocuments(whereCondition)
    const result = await this.postsModel.find(whereCondition)
    .skip(skip)
    .limit(defaultLimit)
    .sort({_id: -1})
    .populate('author', 'username email')
    .lean()

    const totalPage = Math.ceil(totalItem / defaultLimit);

    return {
      meta: {
        current: page,
        pageSize: defaultLimit,
        pages: totalPage,
        total: totalItem,
      },
      result,
  }
}

  async findOne(id: string) {
    const exPost = await this.postsModel.findById(id).populate('author', 'username email')
    if(!exPost){
      throw new NotFoundException('Hiện không tìm thấy bài viết này')
    }
    return exPost
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const updatePost = await this.postsModel.findByIdAndUpdate(id, updatePostDto, { new: true })
    if(!updatePost){
      throw new NotFoundException(`Không tìm thấy bài viết`)
    }
    return updatePost;
  }

  async remove(id: string, currentUser: { _id?: string; role?: string }) {
    const exPost = await this.postsModel.findById(id).exec()
    if(!exPost){
      throw new NotFoundException('Không tìm thấy bài viết')
    }

    const isAdmin = currentUser?.role === UserRole.ADMIN;
    const isOwner = exPost.author?.toString() === currentUser?._id?.toString();

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này!');
    }

    await this.postsModel.findByIdAndDelete(id).exec()
    return exPost;
  }
}
