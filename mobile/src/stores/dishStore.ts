import { create } from 'zustand';
import { Dish, DishCategory } from '../types/models';

interface DishState {
  // Estado
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  useMockData: boolean; // Flag para alternar entre mock e dados reais
  mockDishes: Dish[]; // Dados mock para testes
  
  // Ações
  setDishes: (dishes: Dish[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  removeDish: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUseMockData: (useMock: boolean) => void; // Método para alternar mock
  loadMockData: () => void; // Método para carregar dados mock
  
  // Seletores
  getDishById: (id: string) => Dish | undefined;
  getDishesByCategory: (category: DishCategory) => Dish[];
  getActiveDishes: () => Dish[];
  
  // Ações assíncronas (preparadas para API)
  fetchDishes: () => Promise<void>;
  createDish: (dishData: Omit<Dish, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDishAsync: (id: string, updates: Partial<Dish>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
}

export const useDishStore = create<DishState>((set, get) => ({
  // Estado inicial
  dishes: [],
  loading: false,
  error: null,
  useMockData: true, // Por padrão usa dados mock para testes

  // Dados mock para testes
  mockDishes: [
  {
    id: '1',
    name: 'Salmão Grelhado',
    description: 'Salmão fresco grelhado com legumes da estação e molho especial.',
    price: 55.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Risoto de Cogumelos',
    description: 'Risoto cremoso com uma variedade de cogumelos frescos e parmesão.',
    price: 48.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer artesanal com queijo, alface e tomate.',
    price: 32.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Tiramisu',
    description: 'Sobremesa clássica italiana com camadas de biscoitos e mascarpone.',
    price: 25.00,
    category: 'DESSERT',
    active: true,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Vinho Tinto Premium',
    description: 'Uma garrafa de vinho tinto premium para acompanhar sua refeição.',
    price: 75.00,
    category: 'DRINK',
    active: true,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Suco de Laranja Fresco',
    description: 'Suco de laranja natural, fresco e sem conservantes.',
    price: 12.00,
    category: 'DRINK',
    active: true,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Salada Caesar',
    description: 'Salada fresca com alface, croutons, parmesão e molho caesar.',
    price: 28.00,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Pudim de Leite',
    description: 'Pudim de leite condensado com calda de caramelo.',
    price: 18.00,
    category: 'DESSERT',
    active: true,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
] as Dish[],

  // Ações síncronas
  setDishes: (dishes) => set({ dishes }),
  
  addDish: (dish) => set((state) => ({
    dishes: [...state.dishes, dish]
  })),
  
  updateDish: (id, updates) => set((state) => ({
    dishes: state.dishes.map(dish => 
      dish.id === id ? { ...dish, ...updates } : dish
    )
  })),
  
  removeDish: (id) => set((state) => ({
    dishes: state.dishes.filter(dish => dish.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Métodos para gerenciar dados mock
  setUseMockData: (useMock) => set({ useMockData: useMock }),
  
  loadMockData: () => {
    const { mockDishes } = get();
    set({ dishes: mockDishes, loading: false, error: null });
  },

  // Seletores
  getDishById: (id) => {
    const { dishes } = get();
    return dishes.find(dish => dish.id === id);
  },
  
  getDishesByCategory: (category) => {
    const { dishes } = get();
    return dishes.filter(dish => dish.category === category && dish.active);
  },
  
  getActiveDishes: () => {
    const { dishes } = get();
    return dishes.filter(dish => dish.active);
  },

  // Ações assíncronas (preparadas para integração com API)
  fetchDishes: async () => {
    const { useMockData } = get();
    
    if (useMockData) {
      // Simula delay da API para testes
      set({ loading: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { mockDishes } = get();
      set({ dishes: mockDishes, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // const response = await api.get('/dishes');
      // set({ dishes: response.data, loading: false });
      
      // Por enquanto, apenas limpa o loading
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar pratos',
        loading: false 
      });
    }
  },

  createDish: async (dishData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // const response = await api.post('/dishes', dishData);
      // const newDish = response.data;
      
      // Por enquanto, simula criação
      const newDish: Dish = {
        ...dishData,
        id: Date.now().toString(), // Temporário até integrar com API
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      set((state) => ({
        dishes: [...state.dishes, newDish],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar prato',
        loading: false 
      });
    }
  },

  updateDishAsync: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // await api.put(`/dishes/${id}`, updates);
      
      // Por enquanto, atualiza localmente
      set((state) => ({
        dishes: state.dishes.map(dish => 
          dish.id === id 
            ? { ...dish, ...updates, updated_at: new Date().toISOString() }
            : dish
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar prato',
        loading: false 
      });
    }
  },

  deleteDish: async (id) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada para API
      // await api.delete(`/dishes/${id}`);
      
      // Por enquanto, remove localmente
      set((state) => ({
        dishes: state.dishes.filter(dish => dish.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao deletar prato',
        loading: false 
      });
    }
  },
}));