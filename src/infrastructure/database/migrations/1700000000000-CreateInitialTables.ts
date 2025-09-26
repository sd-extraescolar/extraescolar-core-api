import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`cohortes\` (
        \`id\` varchar(36) NOT NULL,
        \`presencialidad_total\` int NOT NULL,
        \`cantidad_clases_total\` int NOT NULL,
        \`profesores\` json NOT NULL,
        \`alumnos\` json NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`eventos\` (
        \`id\` varchar(36) NOT NULL,
        \`fk_cohorte_id\` varchar(36) NOT NULL,
        \`fecha\` date NOT NULL,
        \`alumnos_presentes\` json NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`FK_eventos_cohorte\` (\`fk_cohorte_id\`),
        CONSTRAINT \`FK_eventos_cohorte\` FOREIGN KEY (\`fk_cohorte_id\`) REFERENCES \`cohortes\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`alumnos\` (
        \`id\` varchar(36) NOT NULL,
        \`fk_cohorte_id\` varchar(36) NOT NULL,
        \`porcentaje_presencialidad\` decimal(5,2) NOT NULL DEFAULT '0.00',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`FK_alumnos_cohorte\` (\`fk_cohorte_id\`),
        CONSTRAINT \`FK_alumnos_cohorte\` FOREIGN KEY (\`fk_cohorte_id\`) REFERENCES \`cohortes\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`alumnos\``);
    await queryRunner.query(`DROP TABLE \`eventos\``);
    await queryRunner.query(`DROP TABLE \`cohortes\``);
  }
}
