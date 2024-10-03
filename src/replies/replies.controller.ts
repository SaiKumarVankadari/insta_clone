import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { ReplyDto } from './dto/reply.dto';

@Controller('replies')
export class RepliesController {
    constructor(private readonly replyService: RepliesService){}

    @Post(':commentId')
    async replyToComment(@Param('commentId') commentId: string, @Body() replyDto: ReplyDto){
        const reply = await this.replyService.replyToComment(
            replyDto.userId,
            Number(commentId),
            replyDto.content
        )  
        
        return {
            message: "Reply posted successfully",
            reply
        }
    }

    @Get(':commentId')
    async getAllRepliesToComment(@Param('commentId') commentId: string){
        return await this.replyService.getAllRepliesToComment(Number(commentId))
    }
}
