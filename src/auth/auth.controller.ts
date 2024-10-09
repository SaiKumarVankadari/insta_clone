import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor( private readonly authservice: AuthService){}
    @Post('signup')
    signup(@Body() dto: AuthDto, @Res() res){
        return this.authservice.signup(dto, res)
    }

    @Post('signin')
    signin(@Body() dto :AuthDto, @Req() req, @Res() res){
        return this.authservice.signin(dto, req,res)
    }

    @Get('signout')
    signout(@Req() req, @Res() res){
        return this.authservice.signout(req,res)
    }

}
