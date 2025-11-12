// src/hooks/useFeaturedBooks.ts
import { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { bookService } from '../services/bookService';

export const useFeaturedBooks = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const books = await bookService.getFeaturedBooks();
      console.log('📚 Livros em destaque carregados:', books);
      setFeaturedBooks(books);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar livros em destaque';
      setError(errorMessage);
      console.error('❌ Erro ao carregar livros em destaque:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedBooks();
  }, []);

  return {
    featuredBooks,
    loading,
    error,
    refreshFeaturedBooks: loadFeaturedBooks
  };
};