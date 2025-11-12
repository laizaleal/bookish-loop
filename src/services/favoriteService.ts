// src/services/favoriteService.ts (ATUALIZADO)
import { Book } from '../types/book';
import { books } from '../data/mockData';

class FavoriteService {
  private favorites: Set<string> = new Set();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rebook-favorites');
      if (saved) {
        const favoritesArray = JSON.parse(saved);
        this.favorites = new Set(favoritesArray);
      }
    }
  }

  private saveFavorites() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rebook-favorites', JSON.stringify([...this.favorites]));
    }
  }

  async getFavorites(): Promise<string[]> {
    return Array.from(this.favorites);
  }

  async getFavoriteBooks(): Promise<Book[]> {
    const favoriteIds = Array.from(this.favorites);
    return books.filter(book => favoriteIds.includes(book.id));
  }

  async addToFavorites(bookId: string): Promise<void> {
    this.favorites.add(bookId);
    this.saveFavorites();
  }

  async removeFromFavorites(bookId: string): Promise<void> {
    this.favorites.delete(bookId);
    this.saveFavorites();
  }

  async toggleFavorite(bookId: string): Promise<boolean> {
    if (this.favorites.has(bookId)) {
      await this.removeFromFavorites(bookId);
      return false;
    } else {
      await this.addToFavorites(bookId);
      return true;
    }
  }

  async isFavorite(bookId: string): Promise<boolean> {
    return this.favorites.has(bookId);
  }

  async getFavoriteCount(): Promise<number> {
    return this.favorites.size;
  }
}

export const favoriteService = new FavoriteService();