import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private readonly prisma: PrismaService) { }

    async likePost(userId: number, postId: number) {
        try {
            await this.prisma.like.create({
                data: {
                    userId,
                    postId
                }
            })
            return { message: "Post liked" }
        }
        catch (error) {
            if (error.code === 'P2002') {
                // P2002 is the error code for unique constraint violations
                return { message: "You liked the post" }
            }
            // If another error occurs, you can handle it here or rethrow it
            throw error;
        }
    }

    async getLikesofPost(postId: number) {
        const count = await this.prisma.like.count({
            where: { postId }
        })
        return count;
    }

    async unlikePost(userId: number, postId: number) {
        try{
            const deletedLike = await this.prisma.like.deleteMany({
                where: {
                    userId,
                    postId,
                },
            });
            return "unliked the post"
        }
        catch (error) {
            throw new NotFoundException('Error while unliking the post'); 
          }
    }
}
