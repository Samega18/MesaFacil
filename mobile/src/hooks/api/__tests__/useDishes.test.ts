import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDishes, useDish, useDishMutations, useDishesByCategory } from '../useDishes';
import { dishService } from '../../../services/dishService';
import { DishResponse, CreateDishRequest, UpdateDishRequest } from '../../../types/api';

// Mock do dishService
jest.mock('../../../services/dishService');
const mockDishService = dishService as jest.Mocked<typeof dishService>;

// Mock do errorHandler
jest.mock('../../../services/errorHandler', () => ({
  getErrorMessage: jest.fn((error, context) => `Error in ${context}: ${error.message}`),
}));

// Mock data
const mockDishResponse: DishResponse = {
  id: '1',
  name: 'Pizza Margherita',
  description: 'Pizza clássica com molho de tomate, mussarela e manjericão',
  price: 35.90,
  category: 'MAIN_COURSE',
  active: true,
  image: 'https://example.com/pizza.jpg',
};

const mockDishesResponse: DishResponse[] = [
  mockDishResponse,
  {
    id: '2',
    name: 'Salada Caesar',
    description: 'Salada fresca com alface, croutons e molho caesar',
    price: 18.50,
    category: 'APPETIZER',
    active: true,
    image: 'https://example.com/salad.jpg',
  },
];

describe('useDishes Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDishes', () => {
    it('deve buscar pratos com sucesso', async () => {
      mockDishService.getDishes.mockResolvedValue(mockDishesResponse);

      const { result } = renderHook(() => useDishes());

      // Estado inicial
      expect(result.current.loading).toBe(true);
      expect(result.current.dishes).toEqual([]);
      expect(result.current.error).toBe(null);

      // Aguardar carregamento
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dishes).toEqual(mockDishesResponse);
      expect(result.current.error).toBe(null);
      expect(mockDishService.getDishes).toHaveBeenCalledWith(undefined);
    });

    it('deve tratar erro ao buscar pratos', async () => {
      const errorMessage = 'Erro de rede';
      mockDishService.getDishes.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDishes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dishes).toEqual([]);
      expect(result.current.error).toContain('useDishes.fetchDishes');
      expect(result.current.error).toContain(errorMessage);
    });

    it('deve fazer refresh dos dados', async () => {
      mockDishService.getDishes.mockResolvedValue(mockDishesResponse);

      const { result } = renderHook(() => useDishes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Fazer refresh
      act(() => {
        result.current.refresh();
      });

      expect(result.current.refreshing).toBe(true);

      await waitFor(() => {
        expect(result.current.refreshing).toBe(false);
      });

      expect(mockDishService.getDishes).toHaveBeenCalledTimes(2);
    });

    it('deve refazer busca com refetch', async () => {
      mockDishService.getDishes.mockResolvedValue(mockDishesResponse);

      const { result } = renderHook(() => useDishes());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Refetch
      await act(async () => {
        await result.current.refetch();
      });

      expect(mockDishService.getDishes).toHaveBeenCalledTimes(2);
    });
  });

  describe('useDish', () => {
    it('deve buscar prato específico com sucesso', async () => {
      mockDishService.getDishById.mockResolvedValue(mockDishResponse);

      const { result } = renderHook(() => useDish('1'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dish).toEqual(mockDishResponse);
      expect(result.current.error).toBe(null);
      expect(mockDishService.getDishById).toHaveBeenCalledWith('1');
    });

    it('não deve buscar quando id é null', () => {
      const { result } = renderHook(() => useDish(null));

      expect(result.current.loading).toBe(false);
      expect(result.current.dish).toBe(null);
      expect(mockDishService.getDishById).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao buscar prato específico', async () => {
      const errorMessage = 'Prato não encontrado';
      mockDishService.getDishById.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDish('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dish).toBe(null);
      expect(result.current.error).toContain('useDish.fetchDish');
      expect(result.current.error).toContain(errorMessage);
    });
  });

  describe('useDishMutations', () => {
    it('deve criar prato com sucesso', async () => {
      const createRequest: CreateDishRequest = {
        name: 'Novo Prato',
        description: 'Descrição do novo prato',
        price: 25.00,
        category: 'MAIN_COURSE',
        image: 'https://example.com/new-dish.jpg',
      };

      mockDishService.createDish.mockResolvedValue(mockDishResponse);

      const { result } = renderHook(() => useDishMutations());

      let createdDish: DishResponse | null = null;

      await act(async () => {
        createdDish = await result.current.createDish(createRequest);
      });

      expect(createdDish).toEqual(mockDishResponse);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.createDish).toHaveBeenCalledWith(createRequest);
    });

    it('deve tratar erro ao criar prato', async () => {
      const createRequest: CreateDishRequest = {
        name: 'Novo Prato',
        description: 'Descrição do novo prato',
        price: 25.00,
        category: 'MAIN_COURSE',
        image: 'https://example.com/new-dish.jpg',
      };

      const errorMessage = 'Erro ao criar prato';
      mockDishService.createDish.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDishMutations());

      let createdDish: DishResponse | null = null;

      await act(async () => {
        createdDish = await result.current.createDish(createRequest);
      });

      expect(createdDish).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toContain('useDishMutations.createDish');
      expect(result.current.error).toContain(errorMessage);
    });

    it('deve atualizar prato com sucesso', async () => {
      const updateRequest: UpdateDishRequest = {
        name: 'Prato Atualizado',
        price: 30.00,
      };

      const updatedDish = { ...mockDishResponse, ...updateRequest };
      mockDishService.updateDish.mockResolvedValue(updatedDish);

      const { result } = renderHook(() => useDishMutations());

      let resultDish: DishResponse | null = null;

      await act(async () => {
        resultDish = await result.current.updateDish('1', updateRequest);
      });

      expect(resultDish).toEqual(updatedDish);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.updateDish).toHaveBeenCalledWith('1', updateRequest);
    });

    it('deve deletar prato com sucesso', async () => {
      mockDishService.deleteDish.mockResolvedValue();

      const { result } = renderHook(() => useDishMutations());

      let success = false;

      await act(async () => {
        success = await result.current.deleteDish('1');
      });

      expect(success).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.deleteDish).toHaveBeenCalledWith('1');
    });

    it('deve alternar status do prato com sucesso', async () => {
      const toggledDish = { ...mockDishResponse, active: false };
      mockDishService.toggleDishStatus.mockResolvedValue(toggledDish);

      const { result } = renderHook(() => useDishMutations());

      let resultDish: DishResponse | null = null;

      await act(async () => {
        resultDish = await result.current.toggleDishStatus('1');
      });

      expect(resultDish).toEqual(toggledDish);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockDishService.toggleDishStatus).toHaveBeenCalledWith('1');
    });
  });

  describe('useDishesByCategory', () => {
    it('deve buscar pratos por categoria com sucesso', async () => {
      mockDishService.getDishesByCategory.mockResolvedValue([mockDishResponse]);

      const { result } = renderHook(() => useDishesByCategory('MAIN_COURSE'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dishes).toEqual([mockDishResponse]);
      expect(result.current.error).toBe(null);
      expect(mockDishService.getDishesByCategory).toHaveBeenCalledWith('MAIN_COURSE');
    });

    it('não deve buscar quando categoria é null', () => {
      const { result } = renderHook(() => useDishesByCategory(null));

      expect(result.current.loading).toBe(false);
      expect(result.current.dishes).toEqual([]);
      expect(mockDishService.getDishesByCategory).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao buscar pratos por categoria', async () => {
      const errorMessage = 'Erro ao buscar categoria';
      mockDishService.getDishesByCategory.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDishesByCategory('MAIN_COURSE'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.dishes).toEqual([]);
      expect(result.current.error).toContain('useDishesByCategory.fetchDishes');
      expect(result.current.error).toContain(errorMessage);
    });
  });
});