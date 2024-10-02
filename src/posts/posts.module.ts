import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, FirebaseService]
})
export class PostsModule {}
