export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  price: number;
  originalPrice?: number;
  condition: string;
  imageUrl: string;
  stock: number;
  isbn?: string;
  description?: string;
  category?: string;
}

export interface CartItem {
  id: string;
  book: Book;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  favorites: string[];
  cart: Cart;
}

// Adicione esta interface
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}