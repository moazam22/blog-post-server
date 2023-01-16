import { compactObject } from 'src/utilities/helper';
import { UserPostESResponse } from './dto/post-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from './entities/post.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UsersService } from 'src/users/users.service';
import { PostSearchBody, UpdatePost } from './dto/es-dto';
import { UpdatePostInput } from './dto/create-post.dto';

@Injectable()
export default class PostsESProvider {
  indexName = 'posts';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Saves posts esprovider
   * @param post
   * @param user
   * @returns save
   */
  async save(post: Post, user: User): Promise<void> {
    try {
      const esPayload = {
        userId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        id: post?.id,
        description: post?.description,
        createdAt: post?.createdAt,
        updatedAt: post?.updatedAt,
        title: post?.title,
      };
      await this.elasticsearchService.index<Post>({
        index: this.indexName,
        document: post,
      });
      console.log('------> Record Save In ES');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searchs by user name
   * @param queryString
   * @returns
   */
  async searchByUserName(queryString: string): Promise<UserPostESResponse[]> {
    try {
      const result: any = await this.elasticsearchService.search({
        index: this.indexName,
        body: {
          query: {
            query_string: {
              query: queryString,
              fields: ['firstName', 'lastName'],
            },
          },
        },
      });
      return result?.hits?.hits?.map((item: any) => item?._source);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searchs by post title description
   * @param queryString
   * @returns
   */
  async searchByPostTitleDescription(queryString: string) {
    try {
      const result: any = await this.elasticsearchService.search({
        index: this.indexName,
        body: {
          query: {
            query_string: {
              query: queryString,
              fields: ['title', 'description'],
            },
          },
        },
      });
      return result?.hits?.hits?.map((item: any) => item?._source);
    } catch (error) {
      throw error;
    }
  }

  async removePost(postId: string): Promise<void> {
    try {
      let result = await this.elasticsearchService.deleteByQuery({
        index: this.indexName,
        query: {
          match: {
            id: postId,
          },
        },
      });
      console.log('------> Record Deleted From ES');
    } catch (error) {
      throw error;
    }
  }
  async updatePostES(payload: UpdatePost): Promise<void> {
    try {
      let newPayload = compactObject(payload);
      const script = Object.entries(newPayload).reduce(
        (result, [key, value]) => {
          return `${result} ctx._source.${key}='${value}';`;
        },
        '',
      );

      await this.elasticsearchService.updateByQuery({
        index: this.indexName,
        body: {
          query: {
            match: {
              id: payload?.id,
            },
          },
          script: {
            source: script,
            lang: 'painless',
          },
        },
      });

      console.log('------> Record Updated From ES');
    } catch (error) {
      throw error;
    }
  }
}
