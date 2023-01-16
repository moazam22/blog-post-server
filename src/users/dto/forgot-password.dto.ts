import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdatePasswordInput {
  @Field()
  password: string;

  @Field()
  userKey: string;
}

@ObjectType()
export class ForgotPassword {
  @Field()
  userKey: string;
}
