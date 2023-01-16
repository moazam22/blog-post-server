import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  readTime: string;

  @Field({ nullable: true })
  attachmentUrl: string;
}

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  readTime?: string;

  @Field({ nullable: true })
  attachmentUrl?: string;
}
