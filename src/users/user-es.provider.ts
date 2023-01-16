import { compactObject } from 'src/utilities/helper';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserESProvider {
  indexName = 'posts';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async updateUserES(userPayload: {
    firstName: string | undefined;
    lastName: string | undefined;
    userId: string;
  }): Promise<void> {
    try {
      let newPayload = compactObject(userPayload);
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
              userId: userPayload?.userId,
            },
          },
          script: {
            source: script,
            lang: 'painless',
          },
        },
      });

      console.log('------> User Record Updated In ES');
    } catch (error) {
      throw error;
    }
  }
}
