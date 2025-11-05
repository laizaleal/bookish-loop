import 'dotenv/config';
import { repo } from './db.js';

// Seed with a few books and customers
const books = [
  { title: 'Dom Casmurro', author: 'Machado de Assis', price: 39.9, condition: 'usado', stock: 3, isbn: '978-85-359-0277-5', image_url: null, description: 'Clássico da literatura brasileira.' },
  { title: 'Capitães da Areia', author: 'Jorge Amado', price: 29.9, condition: 'seminovo', stock: 5, isbn: '978-85-359-1100-5', image_url: null, description: 'Romance sobre meninos de rua em Salvador.' },
  { title: 'O Hobbit', author: 'J. R. R. Tolkien', price: 59.9, condition: 'novo', stock: 2, isbn: '978-85-359-1200-6', image_url: null, description: 'A aventura que precede O Senhor dos Anéis.' },
];

const customers = [
  { name: 'Ana Souza', email: 'ana@example.com', phone: '7999999-0001' },
  { name: 'Bruno Lima', email: 'bruno@example.com', phone: '7999999-0002' },
];

for (const b of books) {
  repo.createBook(b as any);
}
for (const c of customers) {
  repo.createCustomer(c as any);
}

console.log('Seed finalizado.');
