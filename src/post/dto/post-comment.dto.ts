import { PostComment } from '../entities/post-comments.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  commentBody: string;

  @Field()
  postId: string;

  @Field({ nullable: true })
  parentId?: string;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  commentBody: string;

  @Field()
  commentId: string;
}

@ObjectType()
export class PostCommentReplies {
  @Field((type) => [PostComment], { nullable: true })
  replies: PostComment[];
}

@ObjectType()
export class UserPostESResponse {
  @Field()
  userId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  postId: string;

  @Field()
  description: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  title: string;
}
