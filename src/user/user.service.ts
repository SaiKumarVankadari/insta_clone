import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async getUserById(id: number){
        const user = await this.prisma.user.findUnique({ where: {id}});

        if(!user){
            return {
                message: "User not found with"
            }
        }
        return{
            user
        }
    }

    async getAllUsers(){
        const users = await this.prisma.user.findMany();
        // console.log(typeof(users))
        if(!users){
            return{
                message: "No users found",
            }
        }
        return{
            users
        }
    }

    async deleteUserById(id: number){
        const user = await this.prisma.user.findUnique({where: {id}});
        if(!user){
            return { message: "User Not found"}
        }

        await this.prisma.post.deleteMany({ where: {userId: id}});
        
        const deleteUser = await this.prisma.user.delete({where: {id}})
        return {message: `user with id ${id} deleted succesfully`}
    }
}
