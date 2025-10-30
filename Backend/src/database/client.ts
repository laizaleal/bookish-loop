import postgres, { type Sql } from 'postgres';
import env from '../config/env';

export const sql = postgres(env.dbUrl, {
  prepare: true,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30
});

export type DbTransaction = Sql;

// transação utilitária
export async function withTx<T>(fn: (tx: DbTransaction) => Promise<T>) {
  return sql.begin(fn);
}
