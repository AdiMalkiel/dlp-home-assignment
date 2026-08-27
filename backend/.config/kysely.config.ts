import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { defineConfig } from 'kysely-ctl';

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),

  migrations: {
    migrationFolder: 'migrations',
  },
});
