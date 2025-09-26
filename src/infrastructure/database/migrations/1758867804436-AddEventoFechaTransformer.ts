import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventoFechaTransformer1758867804436 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // No database changes needed, just updating the entity transformer
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No database changes needed, just updating the entity transformer
    }

}
