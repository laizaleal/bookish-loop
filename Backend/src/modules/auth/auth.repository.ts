import { sql } from '../../database/client';

export async function findUserByEmail(email: string) {
  const rows = await sql/*sql*/`SELECT id, name, email, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] ?? null;
}

export async function insertUser(name: string, email: string, passwordHash: string) {
  const rows = await sql/*sql*/`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING id, name, email, created_at
  `;
  return rows[0];
}
