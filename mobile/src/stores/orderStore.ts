import { create } from 'zustand';
import { OrderStatus, CartItem, OrderWithUI } from '../types/models';
import { orderService } from '../services/orderService';
import { CreateOrderRequest } from '../types/api';

interface OrderState {
  orders: OrderWithUI[];
  loading: boolean;
  error: string | null;
  
  // Ações
  setOrders: (orders: OrderWithUI[]) => void;
  addOrder: (order: OrderWithUI) => void;
  updateOrder: (id: string, updates: Partial<OrderWithUI>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Seletores
  getOrderById: (id: string) => OrderWithUI | undefined;
  getOrdersByStatus: (status: OrderStatus) => OrderWithUI[];
  getRecentOrders: (limit?: number) => OrderWithUI[];
  
  // Ações assíncronas (integradas com API)
  fetchOrders: () => Promise<void>;
  createOrder: (cartItems: CartItem[], observacoes?: string, status?: OrderStatus) => Promise<OrderWithUI | null>;
  updateOrderAsync: (id: string, updates: Partial<OrderWithUI>) => Promise<void>;
  updateOrderStatusAsync: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Estado inicial
  orders: [],
  loading: false,
  error: null,

  // Ações síncronas
  setOrders: (orders) => set({ orders }),
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders] // Adiciona no início para mostrar mais recentes primeiro
  })),
  
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    )
  })),
  
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(order => 
      order.id === id 
        ? { ...order, status, updated_at: new Date().toISOString() }
        : order
    )
  })),
  
  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter(order => order.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Seletores
  getOrderById: (id) => {
    const { orders } = get();
    return orders.find(order => order.id === id);
  },
  
  getOrdersByStatus: (status) => {
    const { orders } = get();
    return orders.filter(order => order.status === status);
  },
  
  getRecentOrders: (limit = 10) => {
    const { orders } = get();
    return orders
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, limit);
  },

  // Ações assíncronas (integradas com API)
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const apiResponse = await orderService.getOrders();
      const orders = apiResponse || []; // A resposta já é um array de OrderResponse
      
      // Converte a resposta da API para o formato esperado pela UI
      const ordersWithUI: OrderWithUI[] = orders.map((order: any) => {
        return {
          id: order.id,
          total_value: Number(order.totalValue || order.total_value || 0), // API retorna totalValue
          status: order.status,
          notes: order.notes,
          created_at: order.createdAt || order.created_at || new Date().toISOString(), // Fallback para data atual se não existir
          updated_at: order.updatedAt || order.updated_at, // API retorna updatedAt
        items: (order.items || []).map((item: any) => ({
          id: item.id,
          order_id: item.order_id || item.orderId,
          dish_id: item.dish_id || item.dishId,
          quantity: item.quantity,
          unit_price: Number(item.unit_price || item.unitPrice || 0), // Converte para número
          subtotal: Number(item.subtotal || 0), // Converte para número
          created_at: item.created_at || item.createdAt,
          // Campos para compatibilidade com UI (vindos do dish)
          name: item.dish?.name || 'Prato não encontrado',
          price: Number(item.dish?.price || item.unit_price || item.unitPrice || 0), // Converte para número
          image: item.dish?.image || '',
        })),
        // Campos para compatibilidade com UI
        orderNumber: `#${order.id.slice(-6)}`,
        date: new Date(order.createdAt || order.created_at || new Date()).toLocaleDateString('pt-BR'),
        time: new Date(order.createdAt || order.created_at || new Date()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        total: Number(order.totalValue || order.total_value || 0), // API retorna totalValue
      };
    });
      
      set({ orders: ordersWithUI, loading: false });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar pedidos',
        loading: false 
      });
    }
  },

  createOrder: async (cartItems: CartItem[], observacoes: string = '', status?: OrderStatus) => {
    set({ loading: true, error: null });
    try {
      const orderData: CreateOrderRequest = {
        items: cartItems.map(cartItem => ({
          dishId: cartItem.dish.id,
          quantity: cartItem.quantity
        })),
        notes: observacoes,
        status: status // Inclui o status se fornecido
      };

      const apiResponse = await orderService.createOrder(orderData);
      const response = apiResponse; // A resposta já é um OrderResponse
      
      // Converte a resposta da API para o formato esperado pela UI
      const newOrderWithUI: OrderWithUI = {
        id: response.id,
        total_value: Number(response.total_value || 0), // Converte para número
        status: response.status,
        notes: response.notes,
        created_at: response.created_at, // API retorna created_at
        updated_at: response.updated_at, // API retorna updated_at
        items: (response.items || []).map(item => ({
          id: item.id,
          order_id: item.order_id,
          dish_id: item.dish_id,
          quantity: item.quantity,
          unit_price: Number(item.unit_price || 0), // Converte para número
          subtotal: Number(item.subtotal || 0), // Converte para número
          created_at: item.created_at,
          // Campos para compatibilidade com UI (vindos do dish)
          name: item.dish?.name || 'Prato não encontrado',
          price: Number(item.dish?.price || item.unit_price || 0), // Converte para número
          image: item.dish?.image || '',
          total: Number((item.unit_price || 0) * item.quantity), // Converte para número
        })),
        // Campos para compatibilidade com UI
        orderNumber: `#${response.id.slice(-6)}`,
        date: new Date(response.created_at || new Date()).toLocaleDateString('pt-BR'),
        time: new Date(response.created_at || new Date()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        total: Number(response.total_value || 0), // Converte para número
      };
      
      // Adiciona o novo pedido ao estado
      set((state) => ({
        orders: [newOrderWithUI, ...state.orders],
        loading: false
      }));
      
      return newOrderWithUI;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar pedido',
        loading: false 
      });
      throw error;
    }
  },

  updateOrderAsync: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await orderService.updateOrder(id, updates);
      
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === id 
            ? { ...order, ...updates, updated_at: new Date().toISOString() }
            : order
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar pedido',
        loading: false 
      });
    }
  },

  updateOrderStatusAsync: async (id, status) => {
    set({ loading: true, error: null });
    try {
      set((state) => {
        const updatedOrders = state.orders.map(order => 
          order.id === id 
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        );
        return {
          orders: updatedOrders,
          loading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do pedido',
        loading: false 
      });
      throw error; // Re-throw para que o handleUpdateStatus possa capturar
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await orderService.deleteOrder(id);
      
      set((state) => ({
        orders: state.orders.filter(order => order.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar pedido',
        loading: false 
      });
    }
  },
}));