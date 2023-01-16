import { PostComment } from './post-comments.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Posts' })
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  title: string;

  @Column({ type: 'varchar' })
  @Field()
  description: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  readTime: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  attachmentUrl: string;

  @ManyToOne((type) => User, { nullable: true })
  @Field({nullable:true})
  user: User;

  @OneToMany((type) => PostComment, (comments) => comments.post, {
    nullable: true,
  
  })
  @Field((type) => [PostComment], { nullable: true })
  postComments: PostComment[];

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date;
}
