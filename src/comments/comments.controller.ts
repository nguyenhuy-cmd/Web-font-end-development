import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
@UseGuards(AuthGuard("jwt"))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

 
  @Post('posts/:postId/comments')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,  
    @Req() req: any,
  ) {
    return await this.commentsService.create(createCommentDto, postId, req.user._id);
  }

  @Get('posts')
  async findAll(
    @Query('current') current: string,
    @Query('limit') limitPage: string,
    @Query('qs') qs: any
    
  ) {
    return this.commentsService.findAll(current, limitPage, qs);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentsService.remove(id);
  }
}
