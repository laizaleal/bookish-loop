export type Condition = 'novo' | 'seminovo' | 'usado';

export interface Book {
  id: string;               // UUID
  title: string;
  author: string;
  price: number;            // centavos ou número decimal simples
  condition: Condition;
  stock: number;            // quantidade em estoque
  isbn?: string | null;
  image_url?: string | null;
  description?: string | null;
  created_at: string;       // ISO string
  updated_at: string;       // ISO string
}

export interface Customer {
  id: string;               // UUID
  name: string;
  email: string;
  phone?: string | null;
  created_at: string;       // ISO string
}
