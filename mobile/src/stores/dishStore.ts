import { create } from 'zustand';
import { Dish, DishCategory } from '../types/models';
import { dishService } from '../services/dishService';
import { CreateDishRequest, UpdateDishRequest } from '../types/api';

interface DishState {
  // Estado
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  
  // Seletores
  getDishById: (id: string) => Dish | undefined;
  getDishesByCategory: (category: DishCategory) => Dish[];
  getActiveDishes: () => Dish[];
  searchDishes: (query: string) => Dish[];
  
  // Ações assíncronas (API)
  fetchDishes: () => Promise<void>;
  refreshDishes: () => Promise<void>;
  createDish: (dishData: CreateDishRequest) => Promise<void>;
  updateDish: (id: string, dishData: UpdateDishRequest) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  toggleDishStatus: (id: string) => Promise<void>;
}

export const useDishStore = create<DishState>((set, get) => ({
  dishes: [],
  loading: false,
  error: null,

  // Buscar todos os pratos da API
  fetchDishes: async () => {
    set({ loading: true, error: null });
    try {
      const dishes = await dishService.getActiveDishes();
      set({ dishes, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar pratos';
      set({ error: errorMessage, loading: false });
    }
  },

  // Atualizar pratos (refresh)
  refreshDishes: async () => {
    const { fetchDishes } = get();
    await fetchDishes();
  },

  // Criar novo prato
  createDish: async (dishData: CreateDishRequest) => {
    set({ loading: true, error: null });
    try {
      const newDish = await dishService.createDish(dishData);
      const { dishes } = get();
      set({ 
        dishes: [...dishes, newDish], 
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar prato';
      set({ error: errorMessage, loading: false });
      throw error; // Re-throw para permitir tratamento no componente
    }
  },

  // Atualizar prato existente
  updateDish: async (id: string, dishData: UpdateDishRequest) => {
    set({ loading: true, error: null });
    try {
      const updatedDish = await dishService.updateDish(id, dishData);
      const { dishes } = get();
      const updatedDishes = dishes.map(dish => 
        dish.id === id ? updatedDish : dish
      );
      set({ 
        dishes: updatedDishes, 
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar prato';
      set({ error: errorMessage, loading: false });
      throw error; // Re-throw para permitir tratamento no componente
    }
  },

  // Deletar prato
  deleteDish: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await dishService.deleteDish(id);
      const { dishes } = get();
      const filteredDishes = dishes.filter(dish => dish.id !== id);
      set({ 
        dishes: filteredDishes, 
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar prato';
      set({ error: errorMessage, loading: false });
      throw error; // Re-throw para permitir tratamento no componente
    }
  },

  // Alternar status ativo/inativo do prato
  toggleDishStatus: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedDish = await dishService.toggleDishStatus(id);
      const { dishes } = get();
      const updatedDishes = dishes.map(dish => 
        dish.id === id ? updatedDish : dish
      );
      set({ 
        dishes: updatedDishes, 
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar status do prato';
      set({ error: errorMessage, loading: false });
      throw error; // Re-throw para permitir tratamento no componente
    }
  },

  // Filtrar pratos por categoria
  getDishesByCategory: (category: DishCategory) => {
    const { dishes } = get();
    return dishes.filter(dish => dish.category === category && dish.active);
  },

  // Obter apenas pratos ativos
  getActiveDishes: () => {
    const { dishes } = get();
    return dishes.filter(dish => dish.active);
  },

  // Buscar prato por ID
  getDishById: (id: string) => {
    const { dishes } = get();
    return dishes.find(dish => dish.id === id);
  },

  // Pesquisar pratos por nome ou descrição
  searchDishes: (query: string) => {
    const { dishes } = get();
    const searchTerm = query.toLowerCase();
    return dishes.filter(dish => 
      dish.active && (
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.description.toLowerCase().includes(searchTerm)
      )
    );
  },
}));