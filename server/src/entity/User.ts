import { IsEmail, Length, ValidationTypes } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BeforeInsert } from "typeorm"
import bcrypt from 'bcryptjs'
import Post from "./Post";
import Vote from "./Vote";
import BaseEntity from "./Entity";
@Entity("users")
export class User extends BaseEntity{

    @Index()
    @IsEmail(undefined, {message: "이메일 주소가 잘못되었습니다."})
    @Length(1, 255, {message: "이메일 형식이 잘못되었습니다."})
    @Column({ unique: true })
    emial: string;
    
    @Index()
    @Length(3, 255, {message: "이메일 형식이 잘못되었습니다."})
    @Column({unique: true})
    username: string;

    @Column()
    @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다.' })
    @Column()
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

}
