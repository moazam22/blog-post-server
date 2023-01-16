import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostCommentsTableMigration1669879717570 implements MigrationInterface {
    name = 'CreatePostCommentsTableMigration1669879717570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PostComments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commentBody" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, "parentIdId" uuid, CONSTRAINT "PK_2440dc3d7ccd7aff688fc008336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_1447229657793c6cd181e3f32aa" FOREIGN KEY ("postId") REFERENCES "UserPosts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostComments" ADD CONSTRAINT "FK_9341fecaa5eb0869577c1d38819" FOREIGN KEY ("parentIdId") REFERENCES "PostComments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_9341fecaa5eb0869577c1d38819"`);
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_1447229657793c6cd181e3f32aa"`);
        await queryRunner.query(`ALTER TABLE "PostComments" DROP CONSTRAINT "FK_33fa6d1609cacfb6b25d580144b"`);
        await queryRunner.query(`DROP TABLE "PostComments"`);
    }

}
