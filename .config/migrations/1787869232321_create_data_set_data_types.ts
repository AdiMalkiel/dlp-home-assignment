import { type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('data_set_data_types')
    .addColumn('data_set_id', 'uuid', (col) =>
      col.notNull().references('data_sets.id').onDelete('cascade'),
    )
    .addColumn('data_type_id', 'uuid', (col) =>
      col.notNull().references('data_types.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('data_set_data_types_pk', [
      'data_set_id',
      'data_type_id',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('data_set_data_types').execute();
}
