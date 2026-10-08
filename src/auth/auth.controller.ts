import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/create-auth.dto.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDtoData: RegisterDto) {
    return await this.authService.register(registerDtoData);
  }

  @Post('login')
  async login(@Body() loginDtoData: LoginDto) {
    return await this.authService.login(loginDtoData);
  }
}

