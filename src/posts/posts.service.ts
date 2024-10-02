import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class PostsService {
    // constructor(
    //     private prisma: PrismaService,
    //     private firebaseService: FirebaseService
    // ) { }

    // async createPost(
    //     userId: number,
    //     caption: string,
    //     imageFile: Express.Multer.File
    // ) {
    //     if (!imageFile) {
    //         return { message: 'No file uploaded' };
    //     }
    //     const imageUrl = await this.firebaseService.uploadFile(imageFile);
    //     const newPost = await this.prisma.posts.create({
    //         data: {
    //             caption,
    //             imageUrl,
    //             userId
    //         },
    //     });
    //     return newPost
    // }
    constructor(private readonly prisma: PrismaService, private readonly firebaseService: FirebaseService) { }

    async createPost(userId: number, caption: string, imageUrl: string): Promise<Post> {
        return this.prisma.post.create({
            data: {
                userId: userId,
                caption: caption,
                imageUrl: imageUrl,
            },
        });
    }

    async getPostById (id: number): Promise <Post | null>{
        return this.prisma.post.findUnique({
            where: {id},
        })
    }

    async getAllPostsByUserId (userId: number): Promise<Post[]>{
        return this.prisma.post.findMany({
            where: {userId }
        })
    }

    async getAllPosts(): Promise<Post[]>{
        return this.prisma.post.findMany();
    }

    async deletePost (id: number):Promise <Post|null>{
        const post = await this.prisma.post.findUnique({ where: {id}});
        if(post){
            const fileName = post.imageUrl.split('/').pop();
            const bucket = this.firebaseService.getStorageBucket();
            const file = bucket.file(fileName);

            await file.delete();

            return this.prisma.post.delete({
                where: { id}
            })
        }
        return null;
    }
}
