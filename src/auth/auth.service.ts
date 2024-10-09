import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
    async hashPassword(password: string) {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(args: { password: string, hash: string }) {
        return await bcrypt.compare(args.password, args.hash);
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async signup(dto: AuthDto, @Res() res:Response) {
        const { username, email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({ where: { email } });

        if (foundUser) {
            throw new BadRequestException("User with email already exists");
        }
        const hashedPassword = await this.hashPassword(password);
        const createUser = await this.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        // Generate token after signup
        const token = this.jwtService.sign({ userId: createUser.id, email: createUser.email })

        // Set token in http only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })

        return {
            message: "SignedUp Succesfully",
            user: {
                id: createUser.id,
                email: createUser.email,
                username: createUser.username,
            },
            access_token: token
        }
    }

    async signin(dto: AuthDto, req: Request, res: Response) {
        const { email, password } = dto;

        const foundUser = await this.prisma.user.findUnique({ where: { email } })

        if (!foundUser) {
            throw new BadRequestException('Email does not exist')
        }

        const isMatch = await this.comparePasswords({
            password,
            hash: foundUser.password
        })
        if (!isMatch) {
            throw new BadRequestException('Wrong password')
        }

        // Generate token after user authentication
        const token = this.jwtService.sign({ userId: foundUser.id, email: foundUser.email });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })

        return res.send({ message: 'logged in succesfully', user: { id: foundUser.id, username: foundUser.username }, access_token: token })
    }

    async signout(req: Request, res: Response) {
        res.clearCookie('jwt');
        return res.send({ message: " Succesfully logged out" })
    }
}
