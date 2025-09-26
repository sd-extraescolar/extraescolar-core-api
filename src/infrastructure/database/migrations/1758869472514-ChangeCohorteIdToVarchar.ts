import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCohorteIdToVarchar1758869472514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint from alumnos if it exists
        try {
            await queryRunner.query(`ALTER TABLE \`alumnos\` DROP FOREIGN KEY \`FK_ebac5044ed4955b2ff522028e68\``);
        } catch (error) {
            // Foreign key might not exist, continue
        }
        
        // Change cohorte id from UUID to VARCHAR
        await queryRunner.query(`ALTER TABLE \`cohortes\` MODIFY COLUMN \`id\` varchar(255) NOT NULL`);
        
        // Recreate foreign key constraint for alumnos
        await queryRunner.query(`ALTER TABLE \`alumnos\` ADD CONSTRAINT \`FK_ebac5044ed4955b2ff522028e68\` FOREIGN KEY (\`fk_cohorte_id\`) REFERENCES \`cohortes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint from alumnos
        await queryRunner.query(`ALTER TABLE \`alumnos\` DROP FOREIGN KEY \`FK_ebac5044ed4955b2ff522028e68\``);
        
        // Change back to UUID
        await queryRunner.query(`ALTER TABLE \`cohortes\` MODIFY COLUMN \`id\` char(36) NOT NULL`);
        
        // Recreate foreign key constraint for alumnos
        await queryRunner.query(`ALTER TABLE \`alumnos\` ADD CONSTRAINT \`FK_ebac5044ed4955b2ff522028e68\` FOREIGN KEY (\`fk_cohorte_id\`) REFERENCES \`cohortes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
