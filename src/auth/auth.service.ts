import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';

import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/create-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // Inject JwtService để tạo token
  ) {}

  async register(registerDtoData: RegisterDto) {
    // Gọi hàm create() từ UserService - đã có hash password sẵn
    const newUser = await this.userService.create(registerDtoData);
    return {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };
  }

  async login(loginDtoData: LoginDto) {
    // Bước 1: Tìm user theo email trong database
    const user = await this.userService.findByEmail(loginDtoData.email);

    // Bước 2: Nếu không tìm thấy user -> báo lỗi
    if (!user) {
      throw new UnauthorizedException('Email không đúng');
    }

    // Bước 3: So sánh password người dùng nhập với password đã hash trong DB
    const isPasswordValid = compareSync(loginDtoData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password không đúng');
    }

    // Bước 4: Tạo payload (thông tin sẽ được mã hóa vào trong token)
    const payload = {
      sub: user._id,   // sub = subject, thường là id của user
      email: user.email,
      username: user.username,
      role: user.role,
    };

    // Bước 5: Tạo JWT access_token và trả về
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
