import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number){
        return this.userService.getUserById(id);
    }

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Delete(':id')
    deleteUserById(@Param('id',ParseIntPipe) id: number){
        return this.userService.deleteUserById(id);
    }
}
