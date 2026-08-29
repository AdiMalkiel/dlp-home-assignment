import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('data_type_type').asEnum(['keywords']).execute();

  await db.schema
    .createTable('data_types')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('type', sql`data_type_type`, (col) => col.notNull())
    .addColumn('content', sql`text[]`, (col) => col.notNull())
    .addColumn('threshold', 'integer', (col) => col.notNull().defaultTo(1))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('data_types').execute();
  await db.schema.dropType('data_type_type').execute();
}
