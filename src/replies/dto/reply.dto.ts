import { IsNotEmpty } from "class-validator";

export class ReplyDto{
    @IsNotEmpty()
    userId: number

    @IsNotEmpty()
    content: string
}