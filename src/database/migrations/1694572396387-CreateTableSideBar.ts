import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableSideBar1694572396387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'side_bar',
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
          { name: 'slug', type: 'varchar', isNullable: false },
          { name: 'category', type: 'jsonb', isNullable: false },
          { name: 'authors', type: 'jsonb', isNullable: false },
          { name: 'publishers', type: 'jsonb', isNullable: false },
          { name: 'distributors', type: 'jsonb', isNullable: false },
          { name: 'products', type: 'jsonb', isNullable: false },
          { name: 'sub_menu', type: 'jsonb', isNullable: false },
          { name: 'type', type: 'varchar', isNullable: false },
          { name: 'status', type: 'varchar', isNullable: false },
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
