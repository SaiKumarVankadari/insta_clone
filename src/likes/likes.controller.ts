import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @Post(':id/like')
    async likePost(@Param('id') postId: string, @Body('userId') userId: number) {
        return this.likesService.likePost(userId, Number(postId));
    }

    @Get(':id')
    async getPostLikes(@Param('id') postId: string) {
        return this.likesService.getLikesofPost(Number(postId));
    }

    @Delete(':postId')
    async unlikePost(@Param('postId') postId: string, @Body('userId') userId: number){
        return this.likesService.unlikePost(userId, Number(postId))
    }
}
