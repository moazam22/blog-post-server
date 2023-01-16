import { PostService } from './post.service';
import { ContextUser } from '../users/dto/context-user.dto';
import { ResponseMsgPayload } from 'src/users/dto/response-message.dto';
import { PostComment } from './entities/post-comments.entity';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateCommentInput, UpdateCommentInput } from './dto/post-comment.dto';
import { CurrentUser } from 'src/customDecorators/current-user.decorator';
import { JwtAuthGraphQLGuard } from 'src/users/jwt-auth-graphql.guard';

@Resolver(() => PostComment)
@UseGuards(JwtAuthGraphQLGuard)
export class PostCommentResolver {
  constructor(private postService: PostService) {}

  /**
   * Mutations post comment resolver
   * @param createCommentInput
   * @param user
   * @returns post comment
   */
  @Mutation((returns) => ResponseMsgPayload)
  async createPostComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: ContextUser,
  ): Promise<ResponseMsgPayload> {
    return await this.postService.createPostComment(
      createCommentInput,
      user?.currentUser,
    );
  }

  /**
   * Mutations post comment resolver
   * @param commentId
   * @returns comment
   */
  @Mutation((returns) => ResponseMsgPayload)
  async deleteComment(
    @Args('commentId') commentId: string,
  ): Promise<ResponseMsgPayload> {
    return await this.postService.deleteComment(commentId);
  }

  /**
   * Mutations post comment resolver
   * @param updateCommentInput
   * @returns comment
   */
  @Mutation((returns) => ResponseMsgPayload)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<ResponseMsgPayload> {
    return await this.postService.updateComment(updateCommentInput);
  }

  /**
   * Resolves field
   * @param postComment
   * @returns reply
   */
  @ResolveField((returns) => [PostComment])
  async reply(@Parent() postComment: PostComment): Promise<PostComment[]> {
    return await this.postService.fetchReplies(postComment);
  }

  /**
   * Resolves field
   * @param postComment
   * @returns parent
   */
  @ResolveField((returns) => PostComment)
  async parent(@Parent() postComment: PostComment): Promise<PostComment> {
    return await this.postService.resolveParent(postComment);
  }
}
