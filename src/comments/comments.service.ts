import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) { }
    async postComment(userId: number, postId: number, content: string) {

        const user = await this.prisma.user.findUnique({where:{id:userId}})
        if(!user){
            return{
                message: "User Not found",
                status: 404,
                success: false
            }
        }
        const post = await this.prisma.post.findUnique({
            where: { id: postId }
        })
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = await this.prisma.comment.create({
            data: {
                userId,
                postId: postId,
                content
            }
        })
        return comment;
    }

    async getCommentByPostId(postId: number) {
        const comments = await this.prisma.comment.findMany({
            where: { postId },
            include: { user: true }
        })
        if (!comments) {
            return "No comments"
        }
        else {
            const commentsCount = await this.prisma.comment.count({ where: { postId } })
            return {
                commentsCount,
                comments,
            }
        }
    }
}
