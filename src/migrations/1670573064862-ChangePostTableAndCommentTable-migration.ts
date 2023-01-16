import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePostTableAndCommentTableMigration1670573064862
  implements MigrationInterface
{
  name = 'ChangePostTableAndCommentTableMigration1670573064862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`,
    );
    await queryRunner.query(
      `CREATE TABLE "Posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "readTime" character varying, "attachmentUrl" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_a8237eded7a9a311081b65ed0b8"`,
    );
    await queryRunner.query(`DROP TABLE "Posts"`);
    await queryRunner.query(
      `ALTER TABLE "PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "UserPosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
