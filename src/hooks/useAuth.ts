// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { User, LoginData, SignupData } from '../types/auth';
import { authService } from '../services/authService';
import { authEvents } from '../utils/authEvents';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário ao inicializar
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (loginData: LoginData): Promise<User> => {
    try {
      setIsLoading(true);
      const user = await authService.login(loginData);
      setUser(user);
      setIsAuthenticated(true);
      authEvents.emit(); // Emitir evento após login
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (signupData: SignupData): Promise<User> => {
    try {
      setIsLoading(true);
      const user = await authService.signup(signupData);
      setUser(user);
      setIsAuthenticated(true);
      authEvents.emit(); // Emitir evento após signup
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      authEvents.emit(); // Emitir evento após logout
    } finally {
      setIsLoading(false);
    }
  }, []);

  // NOVA FUNÇÃO: updateUser
  const updateUser = useCallback(async (updatedUserData: Partial<User>): Promise<User> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setIsLoading(true);
      // Chamar o serviço para atualizar no backend
      const updatedUser = await authService.updateUser(updatedUserData);
      
      // Atualizar o estado local
      setUser(updatedUser);
      authEvents.emit(); // Emitir evento após atualização
      
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const toggleFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const isNowFavorite = await authService.toggleFavorite(bookId);
      // Atualizar o usuário local
      if (user) {
        const updatedFavorites = isNowFavorite 
          ? [...user.favorites, bookId]
          : user.favorites.filter(id => id !== bookId);
        
        setUser({
          ...user,
          favorites: updatedFavorites
        });
        authEvents.emit(); // Emitir evento após toggle favorite
      }
      return isNowFavorite;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      return false;
    }
  }, [isAuthenticated, user]);

  const getFavorites = useCallback(async (): Promise<string[]> => {
    return await authService.getFavorites();
  }, []);

  const isFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    return await authService.isFavorite(bookId);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser, 
    toggleFavorite,
    getFavorites,
    isFavorite
  };
};