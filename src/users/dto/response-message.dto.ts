import { HttpStatus } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

type statusNumber = 200;
@ObjectType()
export class ResponseMsgPayload {
  @Field()
  message: string;

  @Field()
  status: statusNumber | HttpStatus;
}
