import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostComment } from './entities/post-comments.entity';
import { UsersModule } from 'src/users/users.module';
import PostsESProvider from './posts-es.provider';
import { SearchModule } from 'src/elastic-search/elastic-search.module';
import { PostCommentResolver } from './post-comment.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostComment]),
    UsersModule,
    SearchModule,
  ],
  providers: [PostService, PostResolver, PostResolver, PostsESProvider,PostCommentResolver],
})
export class PostModule {}
