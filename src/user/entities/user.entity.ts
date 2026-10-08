import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    // Khóa chính tự động tăng
    @PrimaryGeneratedColumn()
    id: number;

    // Cột username
    @Column()
    username: string;

    // Cột email
    @Column()
    email: string;

    // Cột password
    @Column()
    password: string;
}
