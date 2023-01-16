import { Post } from '../entities/post.entity';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllPosts {
  @Field((type) => [Post], { nullable: true })
  posts?: Post[];

  @Field({ nullable: true })
  count?: number;
}
