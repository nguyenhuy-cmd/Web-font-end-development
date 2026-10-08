import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity.js';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ){}

  hashPassWord(password: string){
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt);
    return hash;
  }
  
  async create(createUserDto: CreateUserDto) {
    const hashPassWord = this.hashPassWord(createUserDto.password)

    createUserDto.password = hashPassWord;

    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAll(currentPage: string, limit: string, qs: any) {
    const page = Number(currentPage) || 1;
    const defaultLimit = Number(limit) || 10;

    // Tính số bản ghi cần bỏ qua
    const skip = (page - 1) * defaultLimit;

    // tìm khiếm name và email
    const whereCondition: any = {}
    if(qs?.username){
      whereCondition.username = { $regex: qs.username, $options: 'i' }
    }
    if(qs?.email){
      whereCondition.email = { $regex: qs.email, $options: 'i' }
    }
    
    // Lấy đư liệu và đếm tổng số bản ghi
    const totalItems = await this.userModel.countDocuments(whereCondition);
    const result = await this.userModel.find(whereCondition)
      .skip(skip)
      .limit(defaultLimit)
      .sort({ _id: -1 })
      .lean(); // lean để trả về raw object, dễ dàng thao tác

    // Tính tổng số trang
    const totalPage = Math.ceil(totalItems / defaultLimit);

    // Xóa trường password trước khi trả về fontend
    const safeResult = result.map(user => {
      const {password, ...rest} = user;
      return rest;
    });

    // Trả về đúng fommat chuẩn
    return {
      meta: {
        current: page,
        pageSize: defaultLimit,
        pages: totalPage,
        total: totalItems
      },
      result: safeResult
    }
  }

  
  async findOne(id: string) {
    const exUser = await this.userModel.findById(id).lean();
    if(!exUser){
      throw new NotFoundException(`Không tìm thấy user với id = ${id}`)
    }
    return {
      id: id,
      exUser
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const exUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).lean();
    if(!exUser){
      throw new NotFoundException('không tìm thấy user')
    }
    return  {
      message: "Đã cập nhật thành công",
      exUser
    }
  }

  async remove(id: string) {
    const exUser = await this.userModel.findByIdAndDelete(id).lean();
    if(!exUser){
      throw new NotFoundException('Không tìm thấy user')
    }
    return {
      message: 'Đã xóa thành công',
      exUser
    }
  }

  // Tìm user theo email - dùng cho chức năng login
  // Không dùng .lean() vì cần giữ nguyên password để so sánh trong AuthService
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
