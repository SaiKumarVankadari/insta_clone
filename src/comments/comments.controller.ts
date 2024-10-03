import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService){}

    @Post(':postId/comment')
    async commentPost(@Param('postId') postId: string, @Body() createCommentDto: createCommentDto){
        const comment = await this.commentService.postComment(
            createCommentDto.userId,
            Number(postId),
            createCommentDto.content
        )
        return {
            message: "comment added successfully",
            comment
        }
    }

    @Get(':postId')
    async getCommentsByPostId(@Param('postId') postId: string){
        return await this.commentService.getCommentByPostId(Number(postId))
    }
}
