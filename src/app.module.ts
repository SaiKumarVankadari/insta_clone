import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, PostsModule, FirebaseModule, LikesModule, CommentsModule],
  controllers: [ UserController],
  providers: [ UserService],
})
export class AppModule {}
