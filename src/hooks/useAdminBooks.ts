// src/hooks/useAdminBooks.ts
import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types/book';
import { books as mockBooks } from '../data/mockData';

export const useAdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega TODOS os livros (sem paginação)
  const loadAllBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [ADMIN] Carregando TODOS os livros...');
      
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Usa todos os livros do mock data
      setBooks(mockBooks);
      
      console.log('✅ [ADMIN] Todos os livros carregados:', mockBooks.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar todos os livros';
      setError(errorMessage);
      console.error('❌ [ADMIN] Erro ao carregar todos os livros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Funções de administração
  const createBook = async (book: Book): Promise<Book> => {
    try {
      setLoading(true);
      const newBook = { 
        ...book, 
        id: Date.now().toString(),
        originalPrice: book.price * 1.8
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
      const updatedBook = { 
        ...book, 
        id,
        originalPrice: book.price * 1.8
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

  // Carrega todos os livros quando o hook é inicializado
  useEffect(() => {
    loadAllBooks();
  }, [loadAllBooks]);

  return {
    books,
    loading,
    error,
    loadAllBooks,
    createBook,
    updateBook,
    deleteBook
  };
};