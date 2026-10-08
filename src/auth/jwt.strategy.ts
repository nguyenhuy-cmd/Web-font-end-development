import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
``
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // Lấy token từ header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Không chấp nhận token đã hết hạn
      ignoreExpiration: false,
      // Dùng secret key từ .env để giải mã token
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Hàm này được gọi sau khi token đã được xác thực hợp lệ
  // payload chính là object mà chúng ta đã sign lúc login
  async validate(payload: any) {
    return {
      _id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
