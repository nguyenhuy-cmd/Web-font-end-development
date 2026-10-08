import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Like, Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ){}

  hashPassWord(password: string){
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const hashPassWord = this.hashPassWord(createUserDto.password)

    createUserDto.password = hashPassWord;

    const newUser = this.userRepo.create(createUserDto)
    return await this.userRepo.save(newUser)
  }

  async findAll(currentPage: string, limit: string, qs: any) {
    const page = Number(currentPage) || 1;
    const defaultLimit = Number(limit) || 10;

    // Tính số bản ghi cần bỏ qua
    const skip = (page - 1) * defaultLimit;

    // tìm khiếm name và email
    const whereCondition: any = {}
    if(qs?.username){
      whereCondition.username = Like(`%${qs.username}%`)
    }
    if(qs?.email){
      whereCondition.email = Like(`%${qs.email}%`)
    }
    
    // Lấy đư liệu và đếm tổng số bản ghi
    const [result, totalTtems]  = await this.userRepo.findAndCount({
      where: whereCondition,
      skip: skip,
      take: defaultLimit,
      order: {id: 'DESC'} // sắp xép bản ghi mới lên đầu
    })

    // Tính tổng số trang
    const totalPage = Math.ceil(totalTtems / defaultLimit);

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
        total: totalTtems
      },
      result: safeResult
    }
  }

  
  async findOne(id: number) {
    const exUser = this.userRepo.findOne({where: {id}});
    if(!exUser){
      throw new NotFoundException(`Không tìm thấy user với id = ${id}`)
    }
    return {
      id: id,
      exUser
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exUser = await this.userRepo.update(id, updateUserDto);
    if(exUser.affected === 0){
      throw new NotFoundException('không tìm thấy user')
    }
    return  {
      message: "Đã cập nhật thành công",
      exUser
    }
  }

  async remove(id: number) {
    const exUser = await this.userRepo.delete(id);
    if(exUser.affected){
      throw new NotFoundException('Không tìm thấy user')
    }
    return {
      message: 'Đã xóa thành công',
      exUser
    }
  }
}
