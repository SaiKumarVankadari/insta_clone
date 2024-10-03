import { IsNotEmpty } from "class-validator";

export class createCommentDto{
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    postId: number

    @IsNotEmpty()
    content: string
}