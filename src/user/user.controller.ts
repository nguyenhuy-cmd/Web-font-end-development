import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ResponseMessage } from '../common/decorator/customize.js';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from './entities/user.entity.js';
import { Roles } from '../common/decorator/roles.decorator.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Thêm thành viên thành công')
  @Post("user")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ResponseMessage("Xem tất cả thành viên user")
  @Get('user')
  async findAll(
    @Query('curren') currentPage: string,
    @Query('pageSize') limit: string,
    @Query('qs') qs: any,
  ) {
    return await this.userService.findAll(currentPage, limit, qs);
  }

  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ResponseMessage("Xem chi tiết thành viên user")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ResponseMessage("Cập nhập user thành công")
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ResponseMessage("Xóa user thành công")
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
