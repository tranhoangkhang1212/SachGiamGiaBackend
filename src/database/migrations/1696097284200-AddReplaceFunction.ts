import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReplaceFunction1696097284200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
