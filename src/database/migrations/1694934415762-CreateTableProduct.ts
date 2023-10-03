import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableProduct1694597164907 implements MigrationInterface {
  name?: string;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
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
          { name: 'sub_id', type: 'varchar', isNullable: true },
          { name: 'slug', type: 'varchar', isNullable: false },
          { name: 'images', type: 'jsonb', isNullable: false },
          { name: 'author_id', type: 'uuid', isNullable: false },
          { name: 'publisher_id', type: 'uuid', isNullable: false },
          { name: 'category_id', type: 'uuid', isNullable: false },
          { name: 'distributor_id', type: 'uuid', isNullable: false },
          { name: 'price', type: 'float8', isNullable: false },
          { name: 'final_price', type: 'float8', isNullable: false },
          { name: 'sale_off', type: 'int4', isNullable: false },
          { name: 'total_view', type: 'int8', isNullable: false, default: 0 },
          { name: 'total_buy', type: 'int8', isNullable: false, default: 0 },
          { name: 'star', type: 'int4', isNullable: false, default: 0 },
          { name: 'status', type: 'varchar', isNullable: false },
          { name: 'description', type: 'varchar', isNullable: false },
          { name: 'statistics', type: 'varchar', isNullable: false },
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

  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
