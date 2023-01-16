import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostCommentColumnNameMigration1669962205017 implements MigrationInterface {
    name = 'UpdatePostCommentColumnNameMigration1669962205017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_9341fecaa5eb0869577c1d38819"`);
        await queryRunner.query(`ALTER TABLE "PostComments" RENAME COLUMN "parentIdId" TO "parentId"`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_f6f327ec68b7f0259126fa8c053" FOREIGN KEY ("parentId") REFERENCES "PostComments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_f6f327ec68b7f0259126fa8c053"`);
        await queryRunner.query(`ALTER TABLE "PostComments" RENAME COLUMN "parentId" TO "parentIdId"`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_9341fecaa5eb0869577c1d38819" FOREIGN KEY ("parentIdId") REFERENCES "PostComments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
