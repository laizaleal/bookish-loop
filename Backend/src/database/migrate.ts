import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from './client';

async function run() {
  const dir = join(process.cwd(), 'src', 'database', 'migrations');
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const f of files) {
    const content = readFileSync(join(dir, f), 'utf8');
    await sql.unsafe(content);
    console.log('[MIGRATION]', f, 'OK');
  }
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
