import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AccessUserPayload {
  @Field({ nullable: true })
  access_token?: string;
}
