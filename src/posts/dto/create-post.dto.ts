import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống' })
    @IsString({ message: 'Tiêu đề phải là dạng chuỗi' })
    title: string;

    @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
    @IsString({ message: 'Nội dung phải là dạng chuỗi' })
    content: string;

    @IsNotEmpty({ message: 'ID tác giả không được để trống' })
    @IsString({ message: 'ID tác giả phải là dạng chuỗi' })
    authorId: string;
}
