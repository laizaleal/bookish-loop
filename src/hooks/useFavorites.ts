// src/hooks/useFavorites.ts (ATUALIZADO)
import { useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, toggleFavorite: authToggleFavorite, isFavorite: authIsFavorite } = useAuth();

  const loadFavoriteCount = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Se autenticado, usar o sistema de autenticação
        const favorites = await authIsFavorite('dummy'); // Chamada dummy para verificar
        // Para contagem, ainda usar o serviço local por enquanto
        const count = await favoriteService.getFavoriteCount();
        setFavoriteCount(count);
      } else {
        // Se não autenticado, usar o sistema local
        const count = await favoriteService.getFavoriteCount();
        setFavoriteCount(count);
      }
    } catch (error) {
      console.error('Erro ao carregar contador de favoritos:', error);
    }
  }, [isAuthenticated, authIsFavorite]);

  const toggleFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      let isNowFavorite: boolean;
      
      if (isAuthenticated) {
        // Usar sistema de autenticação
        isNowFavorite = await authToggleFavorite(bookId);
      } else {
        // Usar sistema local
        isNowFavorite = await favoriteService.toggleFavorite(bookId);
      }
      
      await loadFavoriteCount();
      return isNowFavorite;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authToggleFavorite, loadFavoriteCount]);

  const isFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    if (isAuthenticated) {
      return await authIsFavorite(bookId);
    } else {
      return await favoriteService.isFavorite(bookId);
    }
  }, [isAuthenticated, authIsFavorite]);

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