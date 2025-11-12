// src/services/authService.ts
import { User, LoginData, SignupData } from '../types/auth';

class AuthService {
  private currentUser: User | null = null;

  async login(loginData: LoginData): Promise<User> {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em um sistema real, aqui você faria a chamada para sua API
    const user: User = {
      id: 'user-' + Date.now(),
      email: loginData.email,
      name: loginData.email.split('@')[0], // Nome baseado no email
      favorites: [],
      createdAt: new Date()
    };

    this.currentUser = user;
    this.saveToLocalStorage(user);
    
    return user;
  }

  async signup(signupData: SignupData): Promise<User> {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: 'user-' + Date.now(),
      email: signupData.email,
      name: signupData.name,
      favorites: [],
      createdAt: new Date()
    };

    this.currentUser = user;
    this.saveToLocalStorage(user);
    
    return user;
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
    localStorage.removeItem('rebook-user');
    localStorage.removeItem('rebook-favorites');
    localStorage.removeItem('rebook-cart');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Tentar carregar do localStorage
    const saved = localStorage.getItem('rebook-user');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        this.currentUser = {
          ...userData,
          createdAt: new Date(userData.createdAt)
        };
        return this.currentUser;
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private saveToLocalStorage(user: User): void {
    localStorage.setItem('rebook-user', JSON.stringify(user));
  }

  // Métodos para gerenciar favoritos do usuário
  async toggleFavorite(bookId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;

    const favorites = new Set(user.favorites);
    let isNowFavorite: boolean;

    if (favorites.has(bookId)) {
      favorites.delete(bookId);
      isNowFavorite = false;
    } else {
      favorites.add(bookId);
      isNowFavorite = true;
    }

    user.favorites = Array.from(favorites);
    this.saveToLocalStorage(user);
    
    // Atualizar também o localStorage separado dos favoritos para compatibilidade
    localStorage.setItem('rebook-favorites', JSON.stringify(user.favorites));
    
    return isNowFavorite;
  }

  async getFavorites(): Promise<string[]> {
    const user = this.getCurrentUser();
    return user?.favorites || [];
  }

  async isFavorite(bookId: string): Promise<boolean> {
    const user = this.getCurrentUser();
    return user?.favorites.includes(bookId) || false;
  }
}

export const authService = new AuthService();