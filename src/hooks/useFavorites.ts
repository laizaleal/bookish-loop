// src/hooks/useFavorites.ts (SIMPLIFICADO)
import { useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';

export const useFavorites = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadFavoriteCount = useCallback(async () => {
    try {
      const count = await favoriteService.getFavoriteCount();
      setFavoriteCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de favoritos:', error);
    }
  }, []);

  const toggleFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const isNowFavorite = await favoriteService.toggleFavorite(bookId);
      await loadFavoriteCount(); // Atualiza o contador
      return isNowFavorite;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadFavoriteCount]);

  const isFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    return await favoriteService.isFavorite(bookId);
  }, []);

  // Carrega o contador apenas uma vez no início
  useEffect(() => {
    loadFavoriteCount();
  }, [loadFavoriteCount]);

  return {
    favoriteCount,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavoriteCount
  };
};