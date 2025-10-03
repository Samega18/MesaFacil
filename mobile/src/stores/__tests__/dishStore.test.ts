import { act, renderHook } from '@testing-library/react-native';
import { useDishStore } from '../dishStore';
import { dishService } from '../../services/dishService';
import { Dish } from '../../types/models';

// Mock do dishService
jest.mock('../../services/dishService');
const mockDishService = dishService as jest.Mocked<typeof dishService>;

// Mock data
const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Pizza clássica com molho de tomate, mussarela e manjericão',
    price: 35.90,
    category: 'MAIN_COURSE',
    active: true,
    image: 'https://example.com/pizza.jpg',
  },
  {
    id: '2',
    name: 'Salada Caesar',
    description: 'Salada fresca com alface, croutons e molho caesar',
    price: 18.50,
    category: 'APPETIZER',
    active: true,
    image: 'https://example.com/salad.jpg',
  },
  {
    id: '3',
    name: 'Hambúrguer Inativo',
    description: 'Hambúrguer que está inativo',
    price: 25.00,
    category: 'MAIN_COURSE',
    active: false,
    image: 'https://example.com/burger.jpg',
  },
];

describe('DishStore', () => {
  beforeEach(() => {
    // Reset do store antes de cada teste
    const { result } = renderHook(() => useDishStore());
    act(() => {
      result.current.dishes = [];
      result.current.loading = false;
      result.current.error = null;
    });
    
    // Reset dos mocks
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('deve ter estado inicial correto', () => {
      const { result } = renderHook(() => useDishStore());
      
      expect(result.current.dishes).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('fetchDishes', () => {
    it('deve buscar pratos com sucesso', async () => {
      mockDishService.getActiveDishes.mockResolvedValue(mockDishes);
      
      const { result } = renderHook(() => useDishStore());
      
      await act(async () => {
        await result.current.fetchDishes();
      });
      
      expect(result.current.dishes).toEqual(mockDishes);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.getActiveDishes).toHaveBeenCalledTimes(1);
    });

    it('deve tratar erro ao buscar pratos', async () => {
      const errorMessage = 'Erro de rede';
      mockDishService.getActiveDishes.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useDishStore());
      
      await act(async () => {
        await result.current.fetchDishes();
      });
      
      expect(result.current.dishes).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('deve definir loading como true durante a busca', async () => {
      mockDishService.getActiveDishes.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockDishes), 100))
      );
      
      const { result } = renderHook(() => useDishStore());
      
      act(() => {
        result.current.fetchDishes();
      });
      
      expect(result.current.loading).toBe(true);
    });
  });

  describe('updateDish', () => {
    it('deve atualizar prato com sucesso', async () => {
      const { result } = renderHook(() => useDishStore());
      
      // Primeiro, adicionar o prato ao estado usando fetchDishes
      mockDishService.getDishes.mockResolvedValue([mockDishes[0]]);
      
      await act(async () => {
        await result.current.fetchDishes();
      });
      
      const updatedDish = { ...mockDishes[0], name: 'Pizza Atualizada' };
      const updateRequest = { name: 'Pizza Atualizada' };
      
      mockDishService.updateDish.mockResolvedValue(updatedDish);
      
      await act(async () => {
        await result.current.updateDish('1', updateRequest);
      });
      
      expect(result.current.dishes[0].name).toBe('Pizza Atualizada');
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.updateDish).toHaveBeenCalledWith('1', updateRequest);
    });
  });

  describe('deleteDish', () => {
    it('deve deletar prato com sucesso', async () => {
      const { result } = renderHook(() => useDishStore());
      
      // Configurar estado inicial
      act(() => {
        result.current.dishes = [...mockDishes];
      });
      
      mockDishService.deleteDish.mockResolvedValue();
      
      await act(async () => {
        await result.current.deleteDish('1');
      });
      
      expect(result.current.dishes).not.toContainEqual(
        expect.objectContaining({ id: '1' })
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.deleteDish).toHaveBeenCalledWith('1');
    });
  });

  describe('Seletores', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useDishStore());
      act(() => {
        result.current.dishes = mockDishes;
      });
    });

    it('getDishById deve retornar prato correto', () => {
      const { result } = renderHook(() => useDishStore());
      
      const dish = result.current.getDishById('1');
      expect(dish).toEqual(mockDishes[0]);
      
      const nonExistentDish = result.current.getDishById('999');
      expect(nonExistentDish).toBeUndefined();
    });

    it('getDishesByCategory deve filtrar por categoria', () => {
      const { result } = renderHook(() => useDishStore());
      
      const mainCourses = result.current.getDishesByCategory('MAIN_COURSE');
       expect(mainCourses).toHaveLength(1);
       expect(mainCourses[0].category).toBe('MAIN_COURSE');
      expect(mainCourses[0].active).toBe(true);
    });

    it('getActiveDishes deve retornar apenas pratos ativos', () => {
      const { result } = renderHook(() => useDishStore());
      
      const activeDishes = result.current.getActiveDishes();
      expect(activeDishes).toHaveLength(2);
      expect(activeDishes.every(dish => dish.active)).toBe(true);
    });

    it('searchDishes deve buscar por nome e descrição', () => {
      const { result } = renderHook(() => useDishStore());
      
      const pizzaResults = result.current.searchDishes('pizza');
      expect(pizzaResults).toHaveLength(1);
      expect(pizzaResults[0].name).toContain('Pizza');
      
      const saladResults = result.current.searchDishes('fresca');
      expect(saladResults).toHaveLength(1);
      expect(saladResults[0].description).toContain('fresca');
      
      const noResults = result.current.searchDishes('inexistente');
      expect(noResults).toHaveLength(0);
    });
  });

  describe('toggleDishStatus', () => {
    it('deve alternar status do prato com sucesso', async () => {
      const { result } = renderHook(() => useDishStore());
      
      // Configurar estado inicial
      act(() => {
        result.current.dishes = [mockDishes[0]];
      });
      
      const toggledDish = { ...mockDishes[0], active: false };
      mockDishService.toggleDishStatus.mockResolvedValue(toggledDish);
      
      await act(async () => {
        await result.current.toggleDishStatus('1');
      });
      
      expect(result.current.dishes[0].active).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.toggleDishStatus).toHaveBeenCalledWith('1');
    });
  });
});