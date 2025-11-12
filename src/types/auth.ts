// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  favorites: string[]; // IDs dos livros favoritos
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}