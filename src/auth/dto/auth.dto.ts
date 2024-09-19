import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {

    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
