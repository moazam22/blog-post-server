import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFiledsInUserTableMigration1669810395638 implements MigrationInterface {
    name = 'AddNewFiledsInUserTableMigration1669810395638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "resetPasswordToken" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "resetPasswordTokenExpiredAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "resetPasswordTokenExpiredAt"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "resetPasswordToken"`);
    }

}
