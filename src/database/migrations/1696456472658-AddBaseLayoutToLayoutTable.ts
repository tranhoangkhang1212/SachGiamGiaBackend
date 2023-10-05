import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBaseLayoutToLayoutTable1696456472658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE Layout DROP COLUMN IF EXISTS base_layout`);
    await queryRunner.query(`ALTER TABLE Layout ADD COLUMN IF NOT EXISTS base_layout JSONB DEFAULT '{}'::jsonb`);
  }

  public async down(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
