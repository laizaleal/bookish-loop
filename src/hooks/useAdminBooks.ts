// src/hooks/useAdminBooks.ts (CORRIGIDO)
import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types/book';
import { books as initialBooks } from '../data/mockData';

// Chave para armazenar no localStorage
const STORAGE_KEY = 'rebook_admin_books';

export const useAdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar livros do localStorage ou usar os dados iniciais
  const loadBooksFromStorage = useCallback((): Book[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Se não há dados salvos, usa os dados mock iniciais
      return initialBooks;
    } catch (error) {
      console.error('❌ Erro ao carregar livros do localStorage:', error);
      return initialBooks;
    }
  }, []);

  // Função para salvar livros no localStorage
  const saveBooksToStorage = useCallback((booksToSave: Book[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booksToSave));
      console.log('💾 Livros salvos no localStorage:', booksToSave.length);
    } catch (error) {
      console.error('❌ Erro ao salvar livros no localStorage:', error);
    }
  }, []);

  // Carrega TODOS os livros (sem paginação)
  const loadAllBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [ADMIN] Carregando TODOS os livros...');
      
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carrega do localStorage ou usa dados iniciais
      const loadedBooks = loadBooksFromStorage();
      setBooks(loadedBooks);
      
      console.log('✅ [ADMIN] Todos os livros carregados:', loadedBooks.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar todos os livros';
      setError(errorMessage);
      console.error('❌ [ADMIN] Erro ao carregar todos os livros:', err);
    } finally {
      setLoading(false);
    }
  }, [loadBooksFromStorage]);

  // 🔥 ESCUTA ATUALIZAÇÕES DE ESTOQUE - CORRIGIDO
  useEffect(() => {
    const handleStockUpdate = () => {
      console.log('📢 useAdminBooks: Estoque atualizado, recarregando livros...');
      loadAllBooks();
    };

    window.addEventListener('stockUpdated', handleStockUpdate);
    
    return () => {
      window.removeEventListener('stockUpdated', handleStockUpdate);
    };
  }, []); // 🔥 REMOVIDA A DEPENDÊNCIA loadAllBooks

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
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      
      // Salva no localStorage
      saveBooksToStorage(updatedBooks);
      
      console.log('📝 Livro criado:', newBook.title);
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
      const updatedBooks = books.map(b => b.id === id ? updatedBook : b);
      setBooks(updatedBooks);
      
      // Salva no localStorage
      saveBooksToStorage(updatedBooks);
      
      console.log('✏️ Livro atualizado:', updatedBook.title);
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
      const bookToDelete = books.find(b => b.id === id);
      
      // Remove do estado local
      const updatedBooks = books.filter(b => b.id !== id);
      setBooks(updatedBooks);
      
      // Salva no localStorage
      saveBooksToStorage(updatedBooks);
      
      console.log('🗑️ Livro deletado:', bookToDelete?.title);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar livro';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar para os dados iniciais
  const resetToInitialData = async (): Promise<void> => {
    try {
      setLoading(true);
      setBooks(initialBooks);
      saveBooksToStorage(initialBooks);
      console.log('🔄 Dados resetados para os valores iniciais');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resetar dados';
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
    deleteBook,
    resetToInitialData
  };
};