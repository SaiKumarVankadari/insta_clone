import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { isEmpty } from 'class-validator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService,
        private readonly firebaseService: FirebaseService
    ) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @Body() createPostDto: CreatePostDto, 
        @UploadedFile() file: Express.Multer.File, 
    ) {

        if (!file) {
            return { message: 'No file uploaded' };
        }

        const fileName = `${uuidv4()}_${file.originalname}`;
        const bucket = this.firebaseService.getStorageBucket();
        const fileUpload = bucket.file(fileName);

        // Upload the image to Firebase
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Generate the public URL to access the uploaded image
        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Store the post details (userId, caption, imageUrl) in the database
        const post = await this.postService.createPost( Number(createPostDto.userId), createPostDto.caption, downloadURL);

        return {
            message: 'Post created successfully!',
            post,
        };
    }

    @Get(':id')
    async getPost(@Param('id') id: string){
        const post = await this.postService.getPostById(Number(id));
        return post ? post : {message: 'Post Not found'};
    }

    @Get('user/:userId')
    async getPostsByUserId(@Param('userId') userId: string){
        const post = await this.postService.getAllPostsByUserId(Number(userId));
        // console.log(typeof(post))
        if( post.length === 0){
            // console.log("Empty posts")
            return { message: 'No posts Found'}
        }
        else{
            // console.log(post)
            return post;
        }
    }

    @Get()
    async getAllPosts(){
        const post = await this.postService.getAllPosts();
        if( post.length === 0){
            // console.log("Empty posts")
            return { message: 'No posts Found'}
        }
        else{
            // console.log(post)
            return post;
        }
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string){
        const deletePost = await this.postService.deletePost(Number(id));
        return deletePost? { message: 'Post deleted Successfully'} : { message: 'Post not deleted'};
    }

}
