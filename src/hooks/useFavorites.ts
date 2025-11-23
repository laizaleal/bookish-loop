// src/hooks/useFavorites.ts (CORRIGIDO)
import { useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from './useAuth';

// Criar um evento customizado para notificar mudanças nos favoritos
const FAVORITES_UPDATED_EVENT = 'favoritesUpdated';

export const useFavorites = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Função para carregar favoritos
  const loadFavorites = useCallback(async () => {
    try {
      console.log('🔄 useFavorites: Carregando favoritos...');
      
      // SEMPRE usa o sistema local para simplificar
      const [favorites, count] = await Promise.all([
        favoriteService.getFavorites(),
        favoriteService.getFavoriteCount()
      ]);
      
      console.log('✅ useFavorites: Favoritos carregados:', favorites.length, 'livros');
      setFavoriteBooks(favorites);
      setFavoriteCount(count);
    } catch (error) {
      console.error('❌ useFavorites: Erro ao carregar favoritos:', error);
    }
  }, []);

  // Função para disparar evento de atualização
  const notifyFavoritesUpdate = useCallback(() => {
    console.log('📢 useFavorites: Disparando evento favoritesUpdated');
    window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT));
  }, []);

  const toggleFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 useFavorites: Alternando favorito para livro:', bookId);
      
      // SEMPRE usa o sistema local
      const isNowFavorite = await favoriteService.toggleFavorite(bookId);
      
      console.log('✅ useFavorites: Favorito alternado. Novo estado:', isNowFavorite);
      
      // Atualiza estado local imediatamente para resposta rápida
      if (isNowFavorite) {
        setFavoriteBooks(prev => [...prev, bookId]);
        setFavoriteCount(prev => prev + 1);
      } else {
        setFavoriteBooks(prev => prev.filter(id => id !== bookId));
        setFavoriteCount(prev => prev - 1);
      }
      
      // Notifica TODOS os componentes
      notifyFavoritesUpdate();
      
      return isNowFavorite;
    } catch (error) {
      console.error('❌ useFavorites: Erro ao alternar favorito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [notifyFavoritesUpdate]);

  const isFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    // Verifica primeiro no estado local para resposta imediata
    if (favoriteBooks.includes(bookId)) {
      return true;
    }
    
    // Depois confirma com o serviço
    return await favoriteService.isFavorite(bookId);
  }, [favoriteBooks]);

  // Carrega os favoritos no início
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Escuta atualizações de favoritos de outros componentes
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      console.log('📢 useFavorites: Evento recebido, recarregando favoritos...');
      loadFavorites();
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdate);
    };
  }, [loadFavorites]);

  return {
    favoriteCount,
    favoriteBooks,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites
  };
};