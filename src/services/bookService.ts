// src/services/bookService.ts
import { Book, PaginatedResponse } from '../types/book';
import { books as initialBooks } from '../data/mockData';

const STORAGE_KEY = 'rebook_admin_books';

class BookService {
  // Função para obter livros do localStorage ou dados iniciais
  private getBooks(): Book[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return initialBooks;
    } catch (error) {
      console.error('Erro ao carregar livros do localStorage:', error);
      return initialBooks;
    }
  }

  async getAllBooks(page: number = 1, limit: number = 12): Promise<PaginatedResponse<Book>> {
    console.log('📖 Buscando todos os livros...');
    
    const allBooks = this.getBooks();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBooks = allBooks.slice(startIndex, endIndex);
    
    console.log('✅ Livros encontrados:', paginatedBooks.length);
    
    return {
      items: paginatedBooks,
      total: allBooks.length,
      page,
      limit,
      totalPages: Math.ceil(allBooks.length / limit)
    };
  }

  async getBookById(id: string): Promise<Book | null> {
    const allBooks = this.getBooks();
    const book = allBooks.find(book => book.id === id) || null;
    console.log('🔍 Buscando livro por ID:', id, book ? 'Encontrado' : 'Não encontrado');
    return book;
  }

  async searchBooks(query: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Book>> {
    console.log('🔎 Buscando livros com query:', query);
    
    const allBooks = this.getBooks();
    
    // Busca case-insensitive em múltiplos campos
    const filteredBooks = allBooks.filter(book =>
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
    
    const allBooks = this.getBooks();
    const filteredBooks = allBooks.filter(book => book.category === category);
    
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
    const allBooks = this.getBooks();
    const featured = allBooks.slice(0, 4);
    console.log('✅ Livros em destaque encontrados:', featured.length);
    return featured;
  }
}

export const bookService = new BookService();