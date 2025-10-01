/**
 * Teste simples dos stores Zustand
 * Este arquivo demonstra como usar os stores criados
 */

import { useDishStore } from '../stores/dishStore';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { Dish, CartItem, Order } from '../types/models';

// Exemplo de uso do DishStore
export const testDishStore = () => {
  const { 
    dishes, 
    setDishes, 
    addDish, 
    updateDish, 
    removeDish,
    getDishById,
    getDishesByCategory,
    getActiveDishes
  } = useDishStore();

  // Exemplo de prato
  const newDish: Dish = {
    id: '1',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer com carne artesanal e ingredientes frescos',
    price: 25.90,
    category: 'MAIN_COURSE',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Testando operações
  addDish(newDish);
  console.log('Pratos ativos:', getActiveDishes());
  console.log('Pratos principais:', getDishesByCategory('MAIN_COURSE'));
};

// Exemplo de uso do CartStore
export const testCartStore = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  } = useCartStore();

  // Exemplo de item do carrinho
  const testDish: Dish = {
    id: '1',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer com carne artesanal e ingredientes frescos',
    price: 25.90,
    category: 'MAIN_COURSE',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Testando operações
  addItem(testDish, 2);
  updateQuantity('1', 3);
  console.log('Total do carrinho:', getTotal());
  console.log('Quantidade de itens:', getItemCount());
};

// Exemplo de uso do OrderStore
export const testOrderStore = () => {
  const {
    orders,
    setOrders,
    addOrder,
    updateOrder,
    removeOrder,
    getOrderById,
    getOrdersByStatus,
    getRecentOrders
  } = useOrderStore();

  // Exemplo de pedido
  const newOrder: Order = {
    id: '1',
    total_value: 51.80,
    status: 'RECEIVED',
    notes: 'Sem cebola',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Testando operações
  addOrder(newOrder);
  console.log('Pedidos recebidos:', getOrdersByStatus('RECEIVED'));
  console.log('Pedidos recentes:', getRecentOrders());
};

console.log('Stores Zustand criados com sucesso!');
console.log('- DishStore: Gerencia pratos do menu');
console.log('- CartStore: Gerencia carrinho de compras');
console.log('- OrderStore: Gerencia pedidos');