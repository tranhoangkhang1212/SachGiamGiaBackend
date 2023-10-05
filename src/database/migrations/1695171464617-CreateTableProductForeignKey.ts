import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateTableProductForeignKey1695171464617 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const authorForeignKey = new TableForeignKey({
      columnNames: ['author_id'],
      referencedTableName: 'author',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('product', authorForeignKey);

    const publisherForeignKey = new TableForeignKey({
      columnNames: ['publisher_id'],
      referencedTableName: 'publisher',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('product', publisherForeignKey);

    const categoryForeignKey = new TableForeignKey({
      columnNames: ['category_id'],
      referencedTableName: 'category',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('product', categoryForeignKey);

    const distributorForeignKey = new TableForeignKey({
      columnNames: ['distributor_id'],
      referencedTableName: 'distributors',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    });
    await queryRunner.createForeignKey('product', distributorForeignKey);
  }

  public async down(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
