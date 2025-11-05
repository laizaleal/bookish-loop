import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { Book, Customer } from './types.js';

const dbFile = process.env.DATABASE_URL || './data.sqlite';
export const db = new Database(dbFile);

// Enable FK and WAL
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('novo','seminovo','usado')),
  stock INTEGER NOT NULL DEFAULT 0,
  isbn TEXT,
  image_url TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TEXT NOT NULL
);
`);

// Repository helpers
export const repo = {
  // BOOKS
  listBooks(params: { search?: string; min?: number; max?: number; condition?: string; limit?: number; offset?: number }) {
    const clauses: string[] = [];
    const args: any[] = [];
    if (params.search) {
      clauses.push("(title LIKE ? OR author LIKE ? OR isbn LIKE ?)");
      const like = `%${params.search}%`;
      args.push(like, like, like);
    }
    if (typeof params.min === 'number') { clauses.push("price >= ?"); args.push(params.min); }
    if (typeof params.max === 'number') { clauses.push("price <= ?"); args.push(params.max); }
    if (params.condition) { clauses.push("condition = ?"); args.push(params.condition); }
    const where = clauses.length ? ("WHERE " + clauses.join(" AND ")) : "";
    const limit = Math.min(params.limit ?? 50, 100);
    const offset = Math.max(params.offset ?? 0, 0);
    const stmt = db.prepare(`SELECT * FROM books ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`);
    return stmt.all(...args, limit, offset) as Book[];
  },

  getBook(id: string) {
    const stmt = db.prepare(`SELECT * FROM books WHERE id = ?`);
    return stmt.get(id) as Book | undefined;
  },

  createBook(data: Omit<Book, 'id'|'created_at'|'updated_at'>) {
    const id = randomUUID();
    const now = new Date().toISOString();
    const stmt = db.prepare(`INSERT INTO books (id,title,author,price,condition,stock,isbn,image_url,description,created_at,updated_at)
                             VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    stmt.run(id, data.title, data.author, data.price, data.condition, data.stock, data.isbn ?? null, data.image_url ?? null, data.description ?? null, now, now);
    return this.getBook(id)!;
  },

  updateBook(id: string, patch: Partial<Omit<Book,'id'|'created_at'>>) {
    const current = this.getBook(id);
    if (!current) return undefined;
    const merged = { ...current, ...patch, updated_at: new Date().toISOString() };
    const stmt = db.prepare(`UPDATE books SET title=?,author=?,price=?,condition=?,stock=?,isbn=?,image_url=?,description=?,updated_at=? WHERE id=?`);
    stmt.run(merged.title, merged.author, merged.price, merged.condition, merged.stock, merged.isbn ?? null, merged.image_url ?? null, merged.description ?? null, merged.updated_at, id);
    return this.getBook(id)!;
  },

  deleteBook(id: string) {
    const stmt = db.prepare(`DELETE FROM books WHERE id = ?`);
    const info = stmt.run(id);
    return info.changes > 0;
  },

  // CUSTOMERS
  listCustomers(limit = 100, offset = 0) {
    const stmt = db.prepare(`SELECT * FROM customers ORDER BY created_at DESC LIMIT ? OFFSET ?`);
    return stmt.all(limit, offset) as Customer[];
  },

  createCustomer(data: Omit<Customer, 'id'|'created_at'>) {
    const id = randomUUID();
    const now = new Date().toISOString();
    const stmt = db.prepare(`INSERT INTO customers (id,name,email,phone,created_at) VALUES (?,?,?,?,?)`);
    stmt.run(id, data.name, data.email, data.phone ?? null, now);
    return this.getCustomer(id)!;
  },

  getCustomer(id: string) {
    const stmt = db.prepare(`SELECT * FROM customers WHERE id = ?`);
    return stmt.get(id) as Customer | undefined;
  }
};
