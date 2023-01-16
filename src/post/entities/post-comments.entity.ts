import { Post } from './post.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'PostComments' })
@ObjectType()
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field({ nullable: false })
  commentBody: string;

  @ManyToOne((type) => User, { nullable: false,eager:true })
  @Field({ nullable: true })
  user: User;

  @ManyToOne((type) => Post, (post) => post.postComments, {
    nullable: false,
    onDelete:"CASCADE"
  })
  @Field((type) => Post, { nullable: true })
  post: Post;

  @ManyToOne((type) => PostComment, { nullable: true })
  @Field({ nullable: true })
  parent: PostComment;

  @Field((type) => [PostComment], { nullable: true })
  reply: PostComment;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date;
}
