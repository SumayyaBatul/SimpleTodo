import { IsEmail,IsNotEmpty,IsString,Length } from "class-validator"

export class LoginDto {
    @IsString()
    @Length(6,20)
    password: string
    @IsEmail()
    @Length(6,20)
    email: string
}