import { create } from 'zustand';
import { Order, OrderStatus, OrderItem, CartItem, OrderWithUI } from '../types/models';

interface OrderState {
  orders: OrderWithUI[];
  loading: boolean;
  error: string | null;
  useMockData: boolean; // Flag para alternar entre mock e dados reais
  mockOrders: OrderWithUI[]; // Dados mock para testes
  
  // Ações
  setOrders: (orders: OrderWithUI[]) => void;
  addOrder: (order: OrderWithUI) => void;
  updateOrder: (id: string, updates: Partial<OrderWithUI>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUseMockData: (useMock: boolean) => void; // Método para alternar mock
  loadMockData: () => void; // Método para carregar dados mock
  
  // Seletores
  getOrderById: (id: string) => OrderWithUI | undefined;
  getOrdersByStatus: (status: OrderStatus) => OrderWithUI[];
  getRecentOrders: (limit?: number) => OrderWithUI[];
  
  // Ações assíncronas (preparadas para API)
  fetchOrders: () => Promise<void>;
  createOrder: (cartItems: CartItem[], observacoes?: string) => Promise<OrderWithUI | null>;
  updateOrderAsync: (id: string, updates: Partial<OrderWithUI>) => Promise<void>;
  updateOrderStatusAsync: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Estado inicial
  orders: [],
  loading: false,
  error: null,
  useMockData: true, // Por padrão usa dados mock para testes

  // Dados mock para testes
  mockOrders: [
    {
      id: '1',
       total_value: 103.00,
       status: 'PREPARING',
      notes: 'Sem cebola no hambúrguer',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item_1_1',
          order_id: '1',
          dish_id: '1',
          quantity: 2,
          unit_price: 25.90,
          subtotal: 51.80,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item_1_2',
          order_id: '1',
          dish_id: '2',
          quantity: 1,
          unit_price: 51.20,
          subtotal: 51.20,
          created_at: new Date().toISOString(),
        }
      ],
      orderNumber: '#12345',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      total: 103.00,
    },
    {
      id: '2',
       total_value: 60.00,
       status: 'DELIVERED',
      notes: 'Mesa 15',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item_2_1',
          order_id: '2',
          dish_id: '3',
          quantity: 1,
          unit_price: 60.00,
          subtotal: 60.00,
          created_at: new Date().toISOString(),
        }
      ],
      orderNumber: '#67890',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      total: 60.00,
    },
    {
      id: '3',
       total_value: 45.00,
       status: 'READY',
      notes: 'Entrega balcão',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item_3_1',
          order_id: '3',
          dish_id: '4',
          quantity: 1,
          unit_price: 30.00,
          subtotal: 30.00,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item_3_2',
          order_id: '3',
          dish_id: '5',
          quantity: 1,
          unit_price: 15.00,
          subtotal: 15.00,
          created_at: new Date().toISOString(),
        }
      ],
      orderNumber: '#24680',
      date: new Date(Date.now() - 30 * 60 * 1000).toLocaleDateString('pt-BR'),
      time: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      total: 45.00,
    },
    {
      id: '4',
       total_value: 125.50,
       status: 'RECEIVED',
      notes: 'Ponto da carne: mal passada',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item_4_1',
          order_id: '4',
          dish_id: '1',
          quantity: 1,
          unit_price: 55.00,
          subtotal: 55.00,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item_4_2',
          order_id: '4',
          dish_id: '2',
          quantity: 1,
          unit_price: 48.00,
          subtotal: 48.00,
          created_at: new Date().toISOString(),
        },
        {
          id: 'item_4_3',
          order_id: '4',
          dish_id: '6',
          quantity: 1,
          unit_price: 22.50,
          subtotal: 22.50,
          created_at: new Date().toISOString(),
        }
      ],
      orderNumber: '#13579',
      date: new Date(Date.now() - 5 * 60 * 1000).toLocaleDateString('pt-BR'),
      time: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      total: 125.50,
    }
  ] as OrderWithUI[],

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

  // Métodos para gerenciar dados mock
  setUseMockData: (useMock) => set({ useMockData: useMock }),
  
  loadMockData: () => {
    const { mockOrders } = get();
    set({ orders: mockOrders });
  },

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

  // Ações assíncronas (preparadas para integração com API)
  fetchOrders: async () => {
    const { useMockData } = get();
    
    set({ loading: true, error: null });
    try {
      if (useMockData) {
        // Usa dados mock para testes
        const { mockOrders } = get();
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API
        set({ orders: mockOrders, loading: false });
      } else {
        // TODO: Implementar chamada para API real
        // const response = await api.get('/orders');
        // set({ orders: response.data, loading: false });
        
        // Por enquanto, simula carregamento da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar pedidos',
        loading: false 
      });
    }
  },

  createOrder: async (cartItems, observacoes) => {
    set({ loading: true, error: null });
    try {
      // Calcula o valor total
      const valor_total = cartItems.reduce((total, item) => total + item.subtotal, 0);
      
      // Cria os itens do pedido
      const orderItems: OrderItem[] = cartItems.map(cartItem => ({
        id: `item_${Date.now()}_${Math.random()}`,
        order_id: '', // Será preenchido após criar o pedido
        dish_id: cartItem.dish.id,
        quantity: cartItem.quantity,
        unit_price: cartItem.dish.price,
        subtotal: cartItem.subtotal,
        created_at: new Date().toISOString(),
        // Campos para compatibilidade com UI
        name: cartItem.dish.name,
        price: cartItem.dish.price,
        image: cartItem.dish.image,
      }));

      // TODO: Implementar chamada para API
      // const response = await api.post('/orders', {
      //   valor_total,
      //   status: 'RECEIVED',
      //   observacoes,
      //   items: orderItems
      // });
      // const newOrder = response.data;
      
      // Por enquanto, simula criação
       const newOrder: OrderWithUI = {
         id: Date.now().toString(),
         total_value: valor_total,
         status: 'RECEIVED',
        notes: observacoes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: orderItems.map(item => ({ ...item, order_id: Date.now().toString() })),
        // Campos para compatibilidade com UI
        orderNumber: `#${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        total: valor_total,
      };
      
      set((state) => ({
        orders: [newOrder, ...state.orders],
        loading: false
      }));
      
      return newOrder;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar pedido',
        loading: false 
      });
      return null;
    }
  },

  updateOrderAsync: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // await api.put(`/orders/${id}`, updates);
      
      // Por enquanto, atualiza localmente
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
      // TODO: Implementar chamada para API
      // await api.patch(`/orders/${id}/status`, { status });
      
      // Por enquanto, atualiza localmente
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === id 
            ? { ...order, status, updated_at: new Date().toISOString() }
            : order
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do pedido',
        loading: false 
      });
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // await api.delete(`/orders/${id}`);
      
      // Por enquanto, remove localmente
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