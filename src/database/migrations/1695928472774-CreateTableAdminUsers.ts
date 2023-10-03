import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableAdminUsers1695928472774 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
            isNullable: false,
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false },
          { name: 'user_name', type: 'varchar', isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'token', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: 'null',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
