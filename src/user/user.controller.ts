import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ResponseMessage } from '../common/decorator/customize.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage('Thêm thành viên thành công')
  @Post("user")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ResponseMessage("Xem tất cả thành viên user")
  @Get('user')
  async findAll(
    @Query('curren') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: any,
  ) {
    return await this.userService.findAll(currentPage, limit, qs);
  }

  @ResponseMessage("Xem chi tiết thành viên user")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @ResponseMessage("Cập nhập user thành công")
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @ResponseMessage("Xóa user thành công")
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
