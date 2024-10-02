import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [AuthModule, PostsModule, FirebaseModule],
  controllers: [ UserController],
  providers: [ UserService],
})
export class AppModule {}
