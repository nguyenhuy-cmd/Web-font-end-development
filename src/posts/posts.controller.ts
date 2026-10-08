import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
@UseGuards(AuthGuard("jwt"))
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

 
  @Post('post')
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  
  @Get('post')
  async findAll(
    @Query('current') current: string,
    @Query('limit') limitPage: string,
    @Query('qs') qs: string) {
    return this.postsService.findAll(current, limitPage, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return await this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(+id);
  }
}
