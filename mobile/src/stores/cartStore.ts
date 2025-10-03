import { create } from 'zustand';
import { CartItem, Dish } from '../types/models';

interface CartState {
  // Estado
  items: CartItem[];
  total: number;

  // Ações
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Seletores
  getItemById: (itemId: string) => CartItem | undefined;
  getItemByDishId: (dishId: string) => CartItem | undefined;
  getTotalItems: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  isEmpty: () => boolean;

  // Utilitários internos
  calculateTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Estado inicial
  items: [],
  total: 0,

  // Ações
  addItem: (dish, quantity = 1) => {
    const { items, calculateTotal } = get();
    const existingItem = items.find(item => item.dish.id === dish.id);
    
    if (existingItem) {
      // Se o item já existe, atualiza a quantidade
      set({
        items: items.map(item =>
          item.dish.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * dish.price
              }
            : item
        )
      });
    } else {
      // Se é um novo item, adiciona ao carrinho
      const newItem: CartItem = {
        id: `cart_${dish.id}_${Date.now()}`,
        dish,
        quantity,
        subtotal: dish.price * quantity
      };
      
      set({
        items: [...items, newItem]
      });
    }
    
    calculateTotal();
  },

  removeItem: (itemId) => {
    const { items, calculateTotal } = get();
    set({
      items: items.filter(item => item.id !== itemId)
    });
    calculateTotal();
  },

  updateQuantity: (itemId, quantity) => {
    const { items, calculateTotal } = get();
    
    if (quantity <= 0) {
      // Se quantidade é 0 ou negativa, remove o item
      set({
        items: items.filter(item => item.id !== itemId)
      });
    } else {
      // Atualiza a quantidade
      set({
        items: items.map(item =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                subtotal: item.dish.price * quantity
              }
            : item
        )
      });
    }
    
    calculateTotal();
  },

  clearCart: () => {
    set({
      items: [],
      total: 0
    });
  },

  // Seletores
  getItemById: (itemId) => {
    const { items } = get();
    return items.find(item => item.id === itemId);
  },

  getItemByDishId: (dishId) => {
    const { items } = get();
    return items.find(item => item.dish.id === dishId);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotal: () => {
    const { total } = get();
    return total;
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  isEmpty: () => {
    const { items } = get();
    return items.length === 0;
  },

  // Utilitários
  calculateTotal: () => {
    const { items } = get();
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    set({ total });
  },
}));