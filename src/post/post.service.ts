import { User } from 'src/users/entities/user.entity';
import { Repository, Equal, IsNull } from 'typeorm';
import { Post } from './entities/post.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ResponseMsgPayload } from 'src/users/dto/response-message.dto';
import { CreatePostInput, UpdatePostInput } from './dto/create-post.dto';
import {
  CreateCommentInput,
  UpdateCommentInput,
  UserPostESResponse,
} from './dto/post-comment.dto';
import { PaginateInput } from 'src/users/dto/user-common.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from './entities/post-comments.entity';
import { compactObject } from 'src/utilities/helper';
import PostsESProvider from './posts-es.provider';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRep: Repository<Post>,
    @InjectRepository(PostComment)
    private postCommentRepo: Repository<PostComment>,
    private postsESProvider: PostsESProvider,
  ) {}

  /**
   * Finds post
   * @param postId
   * @returns post
   */
   async findPost(postId: string): Promise<Post> {
    console.log('comments call post');
    const post = await this.postRep.findOne({
      where: {
        id: postId,
      },
      relations: {
        user: true,
        postComments: {
          user: true,
          parent: true,
          post: true,
        },
      },
    });

    if (post) return post;
    throw new HttpException('Post Not Found!', HttpStatus.NOT_FOUND);
  }

  /**
   * Fetchs all posts
   * @param {
   *     limit = 10,
   *     page = 1,
   *   }
   * @returns all posts
   */
  async fetchAllPosts({
    limit = 10,
    page = 1,
  }: PaginateInput): Promise<[Post[], number]> {
    const skip = (page - 1) * limit;
    return await this.postRep.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
      },
      skip: skip,
      take: limit,
    });
  }

  /**
   * Creates post
   * @param createPostInput
   * @param user
   * @returns post
   */
  async createPost(
    createPostInput: CreatePostInput,
    user: User,
  ): Promise<ResponseMsgPayload> {
    try {
      const post = await this.postRep.save({ ...createPostInput, user });
      this.postsESProvider.save(post, user);

      return { message: 'Successfully Created!', status: HttpStatus.OK };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEsUserPost(query: string): Promise<UserPostESResponse[]> {
    return await this.postsESProvider.searchByUserName(query);
  }
  async getSearchPost(query: string): Promise<Post[]> {
    return await this.postsESProvider.searchByPostTitleDescription(query);
  }

  /**
   * Updates post
   * @param updatePostInput
   * @returns post
   */
  async updatePost(
    updatePostInput: UpdatePostInput,
  ): Promise<ResponseMsgPayload> {
    const { postId, ...result } = updatePostInput;
    await this.findPost(postId);
    await this.postRep.update(postId, { ...result });
    await this.postsESProvider.updatePostES({
      description: result.description,
      title: result?.title,
      id: postId,
    });
    return { message: 'Successfully Updated!', status: HttpStatus.OK };
  }

  /**
   * Deletes post
   * @param postId
   * @returns post
   */
  async deletePost(postId: string): Promise<ResponseMsgPayload> {
    await this.findPost(postId);
    await this.postRep.delete(postId);
    await this.postsESProvider.removePost(postId);
    return { message: 'Successfully Deleted!', status: HttpStatus.OK };
  }

  /**
   * Finds comment
   * @param commentId
   * @returns comment
   */
  async findComment(commentId: string): Promise<PostComment> {
    const comment = await this.postCommentRepo.findOneBy({ id: commentId });
    if (comment) {
      return comment;
    }
    throw new HttpException('Comment Not Found!', HttpStatus.NOT_FOUND);
  }

  /**
   * Creates post comment
   * @param createCommentInput
   * @param user
   * @returns post comment
   */
  async createPostComment(
    createCommentInput: CreateCommentInput,
    user: User,
  ): Promise<ResponseMsgPayload> {
    const { postId, parentId, ...result } = createCommentInput;
    const post = await this.findPost(createCommentInput?.postId);
    let parentComment = null;
    if (parentId) {
      parentComment = await this.findComment(parentId);
    }
    let payload = {
      ...result,
      post,
      user,
      parent: parentComment,
    };
    await this.postCommentRepo.save(compactObject(payload));
    return { message: 'Successfully Added!', status: HttpStatus.OK };
  }

  /**
   * Fetchs post comments
   * @param userPost
   * @returns post comments
   */
  async fetchPostComments(userPost: Post): Promise<PostComment[]> {
    return await this.postCommentRepo.find({
      where: { post: Equal(userPost?.id), parent: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Fetchs replies
   * @param postComment
   * @returns replies
   */
  async fetchReplies(postComment: PostComment): Promise<PostComment[]> {
    return await this.postCommentRepo.find({
      where: { parent: Equal(postComment?.id) },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Resolves parent
   * @param comment
   * @returns parent
   */
  async resolveParent(comment: PostComment): Promise<PostComment> {
    const res = await this.postCommentRepo.findOne({
      where: {
        id: comment?.parent?.id,
      }, relations: {user: true}
    });
    if (res) {
      return res;
    }
    throw new HttpException('not fond !', HttpStatus.NOT_FOUND);
  }

  /**
   * Updates comment
   * @param updateCommentInput
   * @returns comment
   */
  async updateComment(
    updateCommentInput: UpdateCommentInput,
  ): Promise<ResponseMsgPayload> {
    await this.findComment(updateCommentInput?.commentId);
    await this.postCommentRepo.update(updateCommentInput?.commentId, {
      commentBody: updateCommentInput?.commentBody,
    });
    return { message: 'Successfully Deleted!', status: HttpStatus.OK };
  }

  /**
   * Deletes comment
   * @param commentId
   * @returns comment
   */
  async deleteComment(commentId: string): Promise<ResponseMsgPayload> {
    await this.findComment(commentId);
    await this.postCommentRepo.delete(commentId);
    return { message: 'Successfully Deleted!', status: HttpStatus.OK };
  }

  async fetchCurrentUserPosts(
    { limit=10, page=1 }: PaginateInput,
    user: User,
  ): Promise<[Post[], number]> {
    const skip = (page - 1) * limit;

    return await this.postRep.findAndCount({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
  }
}
