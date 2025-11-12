// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import { Cart } from '../types/book';
import { cartService } from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar carrinho';
      setError(errorMessage);
      console.error('Erro ao carregar carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (bookId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.addToCart(bookId, quantity);
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho';
      setError(message);
      console.error('Erro ao adicionar ao carrinho:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.updateCartItemQuantity(itemId, quantity);
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar quantidade';
      setError(message);
      console.error('Erro ao atualizar quantidade:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(message);
      console.error('Erro ao remover item:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao limpar carrinho';
      setError(message);
      console.error('Erro ao limpar carrinho:', err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getItemCount = () => {
    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    refreshCart: loadCart
  };
};