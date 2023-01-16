import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserPostTableUserFieldMigration1669891896446 implements MigrationInterface {
    name = 'UpdateUserPostTableUserFieldMigration1669891896446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserPosts" DROP CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b"`);
        await queryRunner.query(`ALTER TABLE "UserPosts" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "UserPosts" ADD CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserPosts" DROP CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b"`);
        await queryRunner.query(`ALTER TABLE "UserPosts" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "UserPosts" ADD CONSTRAINT "FK_cbfe74fbd515f52d5558d34cb3b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
