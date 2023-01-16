import { User } from './../entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreatedUser {
  @Field((type) => User)
  user: User;
  @Field()
  access_token: string;
}
