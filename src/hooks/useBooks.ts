// src/hooks/useBooks.ts
import { useState, useEffect, useCallback } from 'react';
import { Book, PaginatedResponse } from '../types/book';
import { bookService } from '../services/bookService';
import { books as mockBooks } from '../data/mockData';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // 🔥 NOVO: Recarregar livros quando estoque mudar
  const reloadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks(1, 12);
      setBooks(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
      console.log('🔄 Livros recarregados devido a atualização de estoque');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // useCallback para evitar recriação da função
  const loadBooks = useCallback(async (page: number = 1, limit: number = 12) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando livros...');
      const response: PaginatedResponse<Book> = await bookService.getAllBooks(page, limit);
      setBooks(response.items);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      });
      console.log('✅ Livros carregados:', response.items.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros';
      setError(errorMessage);
      console.error('❌ Erro ao carregar livros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // NOVA FUNÇÃO: Carrega TODOS os livros sem paginação
  const loadAllBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando TODOS os livros...');
      
      // Para mock data, retornamos todos os livros de uma vez
      const allBooks = mockBooks; // Ou await bookService.getAllBooksNoPagination() se tivesse
      
      setBooks(allBooks);
      setPagination({
        page: 1,
        limit: allBooks.length,
        total: allBooks.length,
        totalPages: 1
      });
      console.log('✅ Todos os livros carregados:', allBooks.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar todos os livros';
      setError(errorMessage);
      console.error('❌ Erro ao carregar todos os livros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // useCallback para evitar recriação da função
  const searchBooks = useCallback(async (query: string, page: number = 1, limit: number = 12) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Executando busca por:', query);
      
      const response: PaginatedResponse<Book> = await bookService.searchBooks(query, page, limit);
      setBooks(response.items);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      });
      
      console.log('✅ Resultados da busca:', response.items.length, 'livros encontrados');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar livros';
      setError(errorMessage);
      console.error('❌ Erro ao buscar livros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedBooks = async (): Promise<Book[]> => {
    try {
      return await bookService.getFeaturedBooks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros em destaque';
      setError(errorMessage);
      console.error('❌ Erro ao carregar livros em destaque:', err);
      return [];
    }
  };

  const getBookById = async (id: string): Promise<Book | null> => {
    try {
      return await bookService.getBookById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livro';
      setError(errorMessage);
      console.error('❌ Erro ao carregar livro:', err);
      return null;
    }
  };

  // Funções de administração
  const createBook = async (book: Book): Promise<Book> => {
    try {
      setLoading(true);
      // Em um sistema real, aqui você chamaria bookService.createBook(book)
      const newBook = { 
        ...book, 
        id: Date.now().toString(),
        originalPrice: book.price * 1.8 // Garante que originalPrice seja calculado
      };
      
      // Adiciona ao estado local
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar livro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, book: Book): Promise<Book> => {
    try {
      setLoading(true);
      // Em um sistema real, aqui você chamaria bookService.updateBook(id, book)
      const updatedBook = { 
        ...book, 
        id,
        originalPrice: book.price * 1.8 // Garante que originalPrice seja calculado
      };
      
      // Atualiza no estado local
      setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
      return updatedBook;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar livro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      // Em um sistema real, aqui você chamaria bookService.deleteBook(id)
      
      // Remove do estado local
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar livro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ESCUTA ATUALIZAÇÕES DE ESTOQUE
  useEffect(() => {
    const handleStockUpdate = () => {
      console.log('📢 useBooks: Estoque atualizado, recarregando livros...');
      reloadBooks();
    };

    window.addEventListener('stockUpdated', handleStockUpdate);
    
    return () => {
      window.removeEventListener('stockUpdated', handleStockUpdate);
    };
  }, [reloadBooks]);

  // Carrega os livros apenas uma vez no início (com paginação normal)
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return {
    books,
    loading,
    error,
    pagination,
    loadBooks,
    loadAllBooks, // NOVA FUNÇÃO
    searchBooks,
    getFeaturedBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    refreshBooks: reloadBooks // 🔥 AGORA USA reloadBooks
  };
};