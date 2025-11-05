import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { repo } from './db.js';
import { createBookSchema, updateBookSchema, createCustomerSchema } from './validators.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', now: new Date().toISOString() });
});

// BOOKS
app.get('/books', (req, res) => {
  const { search, min, max, condition, limit, offset } = req.query;
  const list = repo.listBooks({
    search: typeof search === 'string' ? search : undefined,
    min: typeof min === 'string' ? Number(min) : undefined,
    max: typeof max === 'string' ? Number(max) : undefined,
    condition: typeof condition === 'string' ? condition : undefined,
    limit: typeof limit === 'string' ? Number(limit) : undefined,
    offset: typeof offset === 'string' ? Number(offset) : undefined,
  });
  res.json(list);
});

app.get('/books/:id', (req, res) => {
  const book = repo.getBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/books', (req, res) => {
  const parsed = createBookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = repo.createBook(parsed.data);
  res.status(201).json(created);
});

app.put('/books/:id', (req, res) => {
  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const updated = repo.updateBook(req.params.id, parsed.data);
  if (!updated) return res.status(404).json({ error: 'Book not found' });
  res.json(updated);
});

app.delete('/books/:id', (req, res) => {
  const ok = repo.deleteBook(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Book not found' });
  res.status(204).send();
});

// CUSTOMERS
app.get('/customers', (req, res) => {
  const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : 100;
  const offset = typeof req.query.offset === 'string' ? Number(req.query.offset) : 0;
  const list = repo.listCustomers(limit, offset);
  res.json(list);
});

app.post('/customers', (req, res) => {
  const parsed = createCustomerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = repo.createCustomer(parsed.data);
  res.status(201).json(created);
});

// Simple summary for an AdminReports-like page
app.get('/reports/summary', (_req, res) => {
  // lightweight counts without joins to keep it simple
  const books = repo.listBooks({ limit: 1_000_000, offset: 0 });
  const customers = repo.listCustomers(1_000_000, 0);
  const totalInventory = books.reduce((acc, b) => acc + (b.stock ?? 0), 0);
  res.json({
    booksCount: books.length,
    customersCount: customers.length,
    totalInventory
  });
});

app.listen(PORT, () => {
  console.log(`Sebo backend running on http://localhost:${PORT}`);
});
