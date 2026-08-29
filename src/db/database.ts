import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

import type { DB } from './types';
import { env } from '../config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool,
  }),
});
