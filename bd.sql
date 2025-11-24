PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ==========================
-- TABELA books
-- ==========================
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL CHECK(price >= 0),
  condition TEXT NOT NULL CHECK (condition IN ('novo','seminovo','usado')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  isbn TEXT,
  image_url TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ==========================
-- TABELA customers
-- ==========================
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TEXT NOT NULL
);

-- ==========================
-- TABELA orders
-- ==========================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('aberto','pago','enviado','entregue','cancelado')),
  total REAL NOT NULL DEFAULT 0 CHECK(total >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ==========================
-- TABELA order_items
-- ==========================
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price REAL NOT NULL CHECK(price >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- ==========================
-- TRIGGERS to keep orders.total updated
-- ==========================

CREATE TRIGGER IF NOT EXISTS trg_order_items_after_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total = (
    SELECT COALESCE(SUM(quantity * price), 0)
    FROM order_items
    WHERE order_id = NEW.order_id
  ),
  updated_at = DATETIME('now')
  WHERE id = NEW.order_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_order_items_after_update
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total = (
    SELECT COALESCE(SUM(quantity * price), 0)
    FROM order_items
    WHERE order_id = NEW.order_id
  ),
  updated_at = DATETIME('now')
  WHERE id = NEW.order_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_order_items_after_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total = (
    SELECT COALESCE(SUM(quantity * price), 0)
    FROM order_items
    WHERE order_id = OLD.order_id
  ),
  updated_at = DATETIME('now')
  WHERE id = OLD.order_id;
END;

-- ==========================
-- SEED: 10 books (explicit columns to avoid errors)
-- ==========================
INSERT OR IGNORE INTO books (id, title, author, price, condition, stock, isbn, image_url, description, created_at, updated_at) VALUES
('book-0001','Introdução à Programação','Ana Martins',79.90,'novo',12,NULL,NULL,'Livro básico de lógica',DATETIME('now'),DATETIME('now')),
('book-0002','JavaScript Moderno','Carlos Silva',119.50,'novo',20,NULL,NULL,'Guia completo ES6+',DATETIME('now'),DATETIME('now')),
('book-0003','Python para Dados','Marina Farias',139.00,'seminovo',5,NULL,NULL,'Análise de dados com Python',DATETIME('now'),DATETIME('now')),
('book-0004','Estruturas de Dados','João Pedro',89.99,'usado',8,NULL,NULL,'Conceitos fundamentais',DATETIME('now'),DATETIME('now')),
('book-0005','Redes de Computadores','José Torres',149.90,'novo',7,NULL,NULL,'Modelo OSI e TCP/IP',DATETIME('now'),DATETIME('now')),
('book-0006','Banco de Dados SQL','Maria Santos',99.00,'seminovo',10,NULL,NULL,'Curso completo de SQL',DATETIME('now'),DATETIME('now')),
('book-0007','Algoritmos Otimizados','Ricardo Azevedo',129.00,'novo',4,NULL,NULL,'Técnicas avançadas',DATETIME('now'),DATETIME('now')),
('book-0008','Node.js na Prática','Lucas Moreira',119.99,'novo',15,NULL,NULL,'Do básico ao avançado',DATETIME('now'),DATETIME('now')),
('book-0009','HTML & CSS Essencial','Paula Souza',59.90,'novo',30,NULL,NULL,'Fundamentos para web',DATETIME('now'),DATETIME('now')),
('book-0010','TypeScript Completo','Rafael Oliveira',149.00,'seminovo',6,NULL,NULL,'TS aplicado ao desenvolvimento',DATETIME('now'),DATETIME('now'));

-- ==========================
-- SEED: 10 customers
-- ==========================
INSERT OR IGNORE INTO customers (id, name, email, phone, created_at) VALUES
('cust-0001','Ana Paula','ana@example.com','(11) 99999-1111',DATETIME('now')),
('cust-0002','Carlos Henrique','carlos@example.com','(21) 98888-2222',DATETIME('now')),
('cust-0003','Mariana Ribeiro','mariana@example.com','(31) 97777-3333',DATETIME('now')),
('cust-0004','João Pedro','joao@example.com','(41) 96666-4444',DATETIME('now')),
('cust-0005','Fernanda Lima','fernanda@example.com','(71) 95555-5555',DATETIME('now')),
('cust-0006','Ricardo Alves','ricardo@example.com','(61) 94444-6666',DATETIME('now')),
('cust-0007','Luciana Torres','luciana@example.com','(85) 93333-7777',DATETIME('now')),
('cust-0008','Bruno Martins','bruno@example.com','(51) 92222-8888',DATETIME('now')),
('cust-0009','Paula Ferreira','paula@example.com','(91) 91111-9999',DATETIME('now')),
('cust-0010','Tiago Cardoso','tiago@example.com','(81) 90000-0000',DATETIME('now'));

-- ==========================
-- SEED: 10 orders
-- ==========================
INSERT OR IGNORE INTO orders (id, customer_id, status, total, created_at, updated_at) VALUES
('ord-0001','cust-0001','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0002','cust-0002','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0003','cust-0003','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0004','cust-0004','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0005','cust-0005','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0006','cust-0006','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0007','cust-0007','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0008','cust-0008','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0009','cust-0009','aberto',0.0,DATETIME('now'),DATETIME('now')),
('ord-0010','cust-0010','aberto',0.0,DATETIME('now'),DATETIME('now'));

-- ==========================
-- SEED: order_items (10 items)
-- ==========================
INSERT OR IGNORE INTO order_items (id, order_id, book_id, quantity, price) VALUES
('item-0001','ord-0001','book-0001',1,79.90),
('item-0002','ord-0001','book-0009',2,59.90),
('item-0003','ord-0002','book-0005',1,149.90),
('item-0004','ord-0003','book-0003',1,139.00),
('item-0005','ord-0004','book-0006',1,99.00),
('item-0006','ord-0005','book-0008',1,119.99),
('item-0007','ord-0006','book-0002',2,119.50),
('item-0008','ord-0007','book-0010',1,149.00),
('item-0009','ord-0008','book-0004',1,89.99),
('item-0010','ord-0009','book-0007',1,129.00);

-- Ensure order totals are consistent immediately after seeding
UPDATE orders
SET total = COALESCE((
  SELECT SUM(quantity * price) FROM order_items WHERE order_items.order_id = orders.id
), 0),
updated_at = DATETIME('now');

-- Helpful check queries (commented)
-- SELECT COUNT(*) FROM books;
-- SELECT COUNT(*) FROM customers;
-- SELECT COUNT(*) FROM orders;
-- SELECT COUNT(*) FROM order_items;
