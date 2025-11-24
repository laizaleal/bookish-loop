// services/cartService.ts (ATUALIZADO)
import { Book, Cart, CartItem, User } from '../types/book';
import { books } from '../data/mockData';

class CartService {
  private users: Map<string, User> = new Map();
  private currentUserId: string = 'user-1'; // Mock user ID

  constructor() {
    this.initializeMockUser();
  }

  private initializeMockUser() {
    const initialCart: Cart = {
      id: 'cart-1',
      items: [],
      total: 0,
      subtotal: 0,
      shipping: 0
    };

    const mockUser: User = {
      id: this.currentUserId,
      email: 'user@example.com',
      name: 'Usuário Demo',
      favorites: [],
      cart: initialCart
    };

    this.users.set(this.currentUserId, mockUser);
  }

  private calculateCartTotals(cart: Cart): Cart {
    const subtotal = cart.items.reduce((sum, item) => 
      sum + (item.book.price * item.quantity), 0
    );
    
    const shipping = subtotal > 100 ? 0 : 12.90;
    const total = subtotal + shipping;

    return {
      ...cart,
      subtotal,
      shipping,
      total
    };
  }

  async getCart(): Promise<Cart> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return this.calculateCartTotals(user.cart);
  }

  async addToCart(bookId: string, quantity: number = 1): Promise<Cart> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const book = books.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Livro não encontrado');
    }

    if (book.stock < quantity) {
      throw new Error('Estoque insuficiente');
    }

    const existingItemIndex = user.cart.items.findIndex(item => item.book.id === bookId);

    if (existingItemIndex > -1) {
      // Atualiza quantidade se item já existe
      user.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Adiciona novo item
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        book,
        quantity
      };
      user.cart.items.push(newItem);
    }

    // NÃO atualiza estoque aqui - só quando finalizar a compra
    // book.stock -= quantity;

    return this.calculateCartTotals(user.cart);
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const itemIndex = user.cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item não encontrado no carrinho');
    }

    if (quantity <= 0) {
      // Remove item se quantidade for 0 ou negativa
      return this.removeFromCart(itemId);
    }

    const book = user.cart.items[itemIndex].book;
    const quantityDifference = quantity - user.cart.items[itemIndex].quantity;

    // Verifica estoque sem atualizar
    if (book.stock < quantityDifference) {
      throw new Error('Estoque insuficiente');
    }

    user.cart.items[itemIndex].quantity = quantity;

    return this.calculateCartTotals(user.cart);
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const itemIndex = user.cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Item não encontrado no carrinho');
    }

    // Remove item sem devolver ao estoque (pois nunca foi debitado)
    user.cart.items.splice(itemIndex, 1);

    return this.calculateCartTotals(user.cart);
  }

  async clearCart(): Promise<Cart> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Limpa carrinho sem mexer no estoque
    user.cart.items = [];

    return this.calculateCartTotals(user.cart);
  }

  // 🔥 NOVA FUNÇÃO: Finalizar compra e atualizar estoque
  async finalizePurchase(): Promise<{ success: boolean; orderId: string; cart: Cart }> {
    const user = this.users.get(this.currentUserId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.cart.items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    // Verifica estoque antes de finalizar
    for (const item of user.cart.items) {
      const book = books.find(b => b.id === item.book.id);
      if (!book) {
        throw new Error(`Livro "${item.book.title}" não encontrado`);
      }
      if (book.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para "${item.book.title}". Disponível: ${book.stock}, Solicitado: ${item.quantity}`);
      }
    }

    // Atualiza estoque
    for (const item of user.cart.items) {
      const book = books.find(b => b.id === item.book.id);
      if (book) {
        book.stock -= item.quantity;
        console.log(`📦 Estoque atualizado: ${book.title} - ${item.quantity} unidades vendidas. Novo estoque: ${book.stock}`);
      }
    }

    // Salva no localStorage (para persistir as mudanças de estoque)
    this.saveBooksToStorage();

    // Gera ID do pedido
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Limpa o carrinho após a compra
    const finalCart = this.calculateCartTotals(user.cart);
    user.cart.items = [];

    console.log(`✅ Compra finalizada! Pedido: ${orderId}`);
    
    return {
      success: true,
      orderId,
      cart: finalCart
    };
  }

  // 🔥 NOVA FUNÇÃO: Salvar livros no localStorage
  private saveBooksToStorage() {
    try {
      localStorage.setItem('rebook_admin_books', JSON.stringify(books));
      console.log('💾 Estoque salvo no localStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar estoque:', error);
    }
  }
}

export const cartService = new CartService();