import { IsInt, IsString } from 'class-validator';

export class CreatePostDto {
  @IsInt()  // Ensure userId is an integer
  userId: number; // Take userId as input

  @IsString()
  caption: string;
}