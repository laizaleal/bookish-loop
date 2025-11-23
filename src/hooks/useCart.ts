// src/hooks/useCart.ts
import { useState, useEffect, useCallback } from 'react';
import { Cart } from '../types/book';
import { cartService } from '../services/cartService';

// Criar um evento customizado para notificar mudanças no carrinho
const CART_UPDATED_EVENT = 'cartUpdated';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar o carrinho
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar carrinho';
      setError(errorMessage);
      console.error('❌ Erro ao carregar carrinho:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para disparar evento de atualização
  const notifyCartUpdate = useCallback(() => {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }, []);

  // Adicionar ao carrinho
  const addToCart = useCallback(async (bookId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(bookId, quantity);
      setCart(updatedCart);
      notifyCartUpdate(); // Notificar outros componentes
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifyCartUpdate]);

  // Atualizar quantidade
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateCartItemQuantity(itemId, quantity);
      setCart(updatedCart);
      notifyCartUpdate(); // Notificar outros componentes
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quantidade';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifyCartUpdate]);

  // Remover do carrinho
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      notifyCartUpdate(); // Notificar outros componentes
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover do carrinho';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifyCartUpdate]);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      notifyCartUpdate(); // Notificar outros componentes
      return updatedCart;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar carrinho';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifyCartUpdate]);

  // Obter contagem de itens
  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Efeito para carregar o carrinho inicial
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Efeito para escutar atualizações do carrinho
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, [loadCart]);

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