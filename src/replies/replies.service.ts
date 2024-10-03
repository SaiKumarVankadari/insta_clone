import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RepliesService {
    constructor(private readonly prisma: PrismaService){}

    async replyToComment(userId: number, commentId: number, content: string){
        const user = await this.prisma.user.findUnique({where:{id:userId}})
        if(!user){
            return{
                message: "User Not found",
                status: 404,
                success: false
            }
        }
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId }
        })
        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        const reply = await this.prisma.reply.create({
            data:{
                userId,
                commentId,
                content
            }
        })
        return reply
    }

    async getAllRepliesToComment(commentId: number){
        const replies = await this.prisma.reply.findMany({where: {commentId}})

        if(!replies){
            return{
                message: "No replies to this comment"
            }
        }
        else{
            const replyCount = await this.prisma.reply.count({where: {commentId}});
            return{
                replyCount: replyCount,
                replies
            }
        }
    }
}
