import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableProduct1694597164907 implements MigrationInterface {
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
          { name: 'sub_id', type: 'varchar', isNullable: false },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'slug', type: 'varchar', isNullable: false },
          { name: 'image', type: 'varchar', isNullable: false },
          { name: 'author', type: 'varchar', isNullable: false },
          { name: 'publisher', type: 'varchar', isNullable: false },
          { name: 'category_id', type: 'varchar', isNullable: false },
          { name: 'price', type: 'float8', isNullable: false },
          { name: 'final_price', type: 'float8', isNullable: false },
          { name: 'sale_off', type: 'int4', isNullable: false },
          { name: 'description', type: 'varchar', isNullable: false },
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
            isNullable: false,
            default: 'NOW()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
