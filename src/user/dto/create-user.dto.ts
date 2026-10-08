import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    // Tên đăng nhập không được để trống và phải là chuỗi
    @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
    @IsString()
    username: string;

    // Email phải đúng định dạng và không được để trống
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    // Mật khẩu không được để trống và phải từ 6 ký tự trở lên
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}
