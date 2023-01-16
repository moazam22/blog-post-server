import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AllPosts } from './dto/post.dto';
import { PaginateInput } from 'src/users/dto/user-common.dto';
import { PostComment } from './entities/post-comments.entity';
import { ResponseMsgPayload } from 'src/users/dto/response-message.dto';
import { CreatePostInput, UpdatePostInput } from './dto/create-post.dto';
import { CurrentUser } from 'src/customDecorators/current-user.decorator';
import { ContextUser } from 'src/users/dto/context-user.dto';
import { JwtAuthGraphQLGuard } from 'src/users/jwt-auth-graphql.guard';
import { UseGuards } from '@nestjs/common';
import { UserPostESResponse } from './dto/post-comment.dto';

@Resolver(() => Post)
@UseGuards(JwtAuthGraphQLGuard)
export class PostResolver {
  constructor(private postService: PostService) {}

  /**
   * Querys user post resolver
   * @param paginateInput
   * @returns all posts
   */
  @Query((returns) => AllPosts)
  async fetchAllPosts(
    @Args('paginateInput') paginateInput: PaginateInput,
  ): Promise<{ posts?: Post[]; count?: number }> {
    let [posts, count] = await this.postService.fetchAllPosts({
      ...paginateInput,
    });
    return {
      posts,
      count,
    };
  }

  /**
   * Querys user post resolver
   * @param postId
   * @returns post
   */
  @Query((returns) => Post)
  async fetchPost(@Args('postId') postId: string): Promise<Post> {
    return await this.postService.findPost(postId);
  }

  @Query(() => [UserPostESResponse])
  async searchUserPostES(
    @Args('queryString') queryString: string,
  ): Promise<UserPostESResponse[]> {
    return await this.postService.getEsUserPost(queryString);
  }
  @Query(() => [Post])
  async searchPost(
    @Args('queryString') queryString: string,
  ): Promise<Post[]> {
    return await this.postService.getSearchPost(queryString);
  }

  /**
   * Mutations user post resolver
   * @param createPostInput
   * @param user
   * @returns user post
   */
  @Mutation((returns) => ResponseMsgPayload)
  async createUserPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: ContextUser,
  ): Promise<any> {
    return await this.postService.createPost(
      createPostInput,
      user?.currentUser,
    );
  }

  /**
   * Mutations user post resolver
   * @param updatePostInput
   * @returns user post
   */
  @Mutation((returns) => ResponseMsgPayload)
  async updateUserPost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<any> {
    return await this.postService.updatePost(updatePostInput);
  }

  /**
   * Mutations user post resolver
   * @param postId
   * @returns post
   */
  @Mutation((returns) => ResponseMsgPayload)
  async deletePost(
    @Args('postId') postId: string,
  ): Promise<ResponseMsgPayload> {
    return await this.postService.deletePost(postId);
  }

  @ResolveField((returns) => [PostComment])
  async postComments(@Parent() post: Post): Promise<PostComment[]> {
    return await this.postService.fetchPostComments(post);
  }

  @Query((returns) => AllPosts)
  async fetchUserPosts(
    @Args('paginateInput') paginateInput: PaginateInput,
    @CurrentUser() user: ContextUser,
  ): Promise<{ posts?: Post[]; count?: number }> {
    const [posts, count] = await this.postService.fetchCurrentUserPosts(
      {
        ...paginateInput,
      },
      user.currentUser,
    );
    return {
      posts,
      count,
    };
  }

 
}
