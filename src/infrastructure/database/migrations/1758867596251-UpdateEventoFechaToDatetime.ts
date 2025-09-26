import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEventoFechaToDatetime1758867596251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`eventos\` MODIFY COLUMN \`fecha\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`eventos\` MODIFY COLUMN \`fecha\` date NOT NULL`);
    }

}
