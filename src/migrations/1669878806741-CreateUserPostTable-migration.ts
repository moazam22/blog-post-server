import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPostTableMigration1669878806741
  implements MigrationInterface
{
  name = 'CreateUserPostTableMigration1669878806741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UserPosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "readTime" character varying, "attachmentUrl" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_c6d12564ec163256c7c48e1dbcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPosts" ADD CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserPosts" DROP CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b"`,
    );
    await queryRunner.query(`DROP TABLE "UserPosts"`);
  }
}
