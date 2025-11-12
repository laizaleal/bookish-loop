// src/services/adminService.ts
import { Book } from '../types/book';
import { books } from '../data/mockData';

class AdminService {
  // Simulação de chamadas API para o admin
  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
    
    const totalBooks = books.length;
    const totalStock = books.reduce((acc, book) => acc + book.stock, 0);
    const lowStockCount = books.filter(book => book.stock < 3).length;
    const outOfStockCount = books.filter(book => book.stock === 0).length;
    
    return {
      totalBooks,
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalRevenue: 34700,
      totalSales: 347,
      averageTicket: 100.03,
      newCustomers: 89
    };
  }

  async getSalesReport(period: string = '6months') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Lógica para gerar relatórios baseados no período
    // Esta é uma versão simplificada
    return {
      salesData: [],
      topBooks: [],
      categories: []
    };
  }
}

export const adminService = new AdminService();