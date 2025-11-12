// src/services/bookService.ts
import { Book, PaginatedResponse } from '../types/book';
import { books } from '../data/mockData';

class BookService {
  async getAllBooks(page: number = 1, limit: number = 12): Promise<PaginatedResponse<Book>> {
    console.log('📖 Buscando todos os livros...');
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = books.slice(startIndex, endIndex);
    
    console.log('✅ Livros encontrados:', paginatedBooks.length);
    
    return {
      items: paginatedBooks,
      total: books.length,
      page,
      limit,
      totalPages: Math.ceil(books.length / limit)
    };
  }

  async getBookById(id: string): Promise<Book | null> {
    const book = books.find(book => book.id === id) || null;
    console.log('🔍 Buscando livro por ID:', id, book ? 'Encontrado' : 'Não encontrado');
    return book;
  }

  async searchBooks(query: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Book>> {
    console.log('🔎 Buscando livros com query:', query);
    
    // Busca case-insensitive em múltiplos campos
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.publisher.toLowerCase().includes(query.toLowerCase()) ||
      (book.category && book.category.toLowerCase().includes(query.toLowerCase())) ||
      (book.description && book.description.toLowerCase().includes(query.toLowerCase()))
    );

    console.log('📚 Livros filtrados:', filteredBooks.length);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    console.log('✅ Resultados da busca paginados:', paginatedBooks.length);
    
    return {
      items: paginatedBooks,
      total: filteredBooks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredBooks.length / limit)
    };
  }

  async getBooksByCategory(category: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Book>> {
    console.log('🏷️ Buscando livros por categoria:', category);
    
    const filteredBooks = books.filter(book => book.category === category);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    console.log('✅ Livros na categoria:', paginatedBooks.length);
    
    return {
      items: paginatedBooks,
      total: filteredBooks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredBooks.length / limit)
    };
  }

  async getFeaturedBooks(): Promise<Book[]> {
    console.log('⭐ Buscando livros em destaque...');
    const featured = books.slice(0, 4);
    console.log('✅ Livros em destaque encontrados:', featured.length);
    console.log('📚 Dados dos livros:', featured);
    return featured;
  }
}

export const bookService = new BookService();