import { User } from './../entities/user.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllUsersDto {
  @Field((type) => [User], { nullable: true })
  users?: User[];

  @Field({ nullable: true })
  count?: number;
}

@InputType()
export class PaginateInput {
  @Field((type) => Int)
  limit?: number;

  @Field((type) => Int)
  page?: number;
}
