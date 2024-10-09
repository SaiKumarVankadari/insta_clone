import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.cookies.jwt; // Get JWT from cookie

        if (!token) {
            throw new ForbiddenException('Access denied. No token provided.');
        }
        // is token valid
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
            const { userId, email } = decoded;
            const isUserFound = await this.prismaService.user.findUnique({
                where: { id: userId, email }
            })
            if (!isUserFound) {
                throw new UnauthorizedException("Invalid Token");
            }

            req.user = decoded
            return true; // Allow the request to proceed
        }
        catch (error) {
            // Handle JWT verification errors
            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException('Invalid Token');
            }
            throw new ForbiddenException('Access denied.'); // Handle other errors
        }
    }
}
