import { Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe,) id: number, @Req() req){
        const loggedInUser = req.user.id;
        if(loggedInUser !== id){
            throw new ForbiddenException("You aare an unauthorised user")
        }
        return this.userService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Delete(':id')
    deleteUserById(@Param('id',ParseIntPipe) id: number){
        return this.userService.deleteUserById(id);
    }
}
