import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    async hashPassword(password: string){
        const saltOrRounds =10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(args: {password:string, hash:string}){
        return await bcrypt.compare(args.password, args.hash);
    }

    async signup(dto:AuthDto){
        const { username,email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({where: {email}});

        if(foundUser){
            throw new BadRequestException ("User with email already exists");
        }
        const hashedPassword = await this.hashPassword(password);
        const createUser = await this.prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword
            }
        })
        return {
            message: "SignedUp Succesfully",
            user: {
                id:createUser.id,
                email:createUser.email,
                username: createUser.username,
            }
        }
    }

    async signin(dto: AuthDto, req: Request, res: Response){
        const {username,  email, password  } = dto;

        const foundUser = await this.prisma.user.findUnique({where: {email}})
        
        if(!foundUser){
            throw new BadRequestException('Email does not exist')
        }

        const isMatch = await this.comparePasswords({
            password,
            hash:foundUser.password
        })
        if(!isMatch){
            throw new BadRequestException('Wrong password')
        }

        return res.send({message: 'logged in succesfully', user:{id: foundUser.id, username:foundUser.username}})
    }

    async signout(req: Request, res: Response){
        return res.send({ message:" Succesfully logged out"})
    }
}
