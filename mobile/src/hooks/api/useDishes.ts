import { useState, useEffect, useCallback } from 'react';
import { dishService } from '../../services/dishService';
import { getErrorMessage } from '../../services/errorHandler';
import {
  DishResponse,
  CreateDishRequest,
  UpdateDishRequest,
  DishFilters,
} from '../../types/api';
import { DishCategory } from '../../types/models';

/**
 * Hook para listar pratos com filtros
 */
export const useDishes = (filters?: DishFilters) => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDishes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const data = await dishService.getDishes(filters);
      setDishes(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishes.fetchDishes');
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDishes(false);
  }, [fetchDishes]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return {
    dishes,
    loading,
    error,
    refreshing,
    refresh,
    refetch: fetchDishes,
  };
};

/**
 * Hook para buscar um prato específico
 */
export const useDish = (id: string | null) => {
  const [dish, setDish] = useState<DishResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDish = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await dishService.getDishById(id);
      setDish(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDish.fetchDish');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDish();
  }, [fetchDish]);

  return {
    dish,
    loading,
    error,
    refetch: fetchDish,
  };
};

/**
 * Hook para operações de criação, atualização e exclusão de pratos
 */
export const useDishMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDish = useCallback(async (dishData: CreateDishRequest): Promise<DishResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newDish = await dishService.createDish(dishData);
      return newDish;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishMutations.createDish');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDish = useCallback(async (id: string, dishData: UpdateDishRequest): Promise<DishResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedDish = await dishService.updateDish(id, dishData);
      return updatedDish;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishMutations.updateDish');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDish = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await dishService.deleteDish(id);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishMutations.deleteDish');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDishStatus = useCallback(async (id: string): Promise<DishResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedDish = await dishService.toggleDishStatus(id);
      return updatedDish;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishMutations.toggleDishStatus');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createDish,
    updateDish,
    deleteDish,
    toggleDishStatus,
    loading,
    error,
  };
};

/**
 * Hook para buscar pratos por categoria
 */
export const useDishesByCategory = (category: DishCategory | null) => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDishesByCategory = useCallback(async () => {
    if (!category) {
      setDishes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await dishService.getDishesByCategory(category);
      setDishes(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishesByCategory.fetchDishesByCategory');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchDishesByCategory();
  }, [fetchDishesByCategory]);

  return {
    dishes,
    loading,
    error,
    refetch: fetchDishesByCategory,
  };
};

/**
 * Hook para buscar pratos ativos
 */
export const useActiveDishes = () => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dishService.getActiveDishes();
      setDishes(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useActiveDishes.fetchActiveDishes');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveDishes();
  }, [fetchActiveDishes]);

  return {
    dishes,
    loading,
    error,
    refetch: fetchActiveDishes,
  };
};

/**
 * Hook para pesquisar pratos
 */
export const useDishSearch = () => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const searchDishes = useCallback(async (term: string) => {
    if (!term.trim()) {
      setDishes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchTerm(term);
      
      const data = await dishService.searchDishes(term);
      setDishes(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDishSearch.searchDishes');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setDishes([]);
    setSearchTerm('');
    setError(null);
  }, []);

  return {
    dishes,
    loading,
    error,
    searchTerm,
    searchDishes,
    clearSearch,
  };
};

/**
 * Hook combinado para gerenciamento completo de pratos
 */
export const useDishManager = (initialFilters?: DishFilters) => {
  const { dishes, loading, error, refresh, refetch } = useDishes(initialFilters);
  const mutations = useDishMutations();
  const search = useDishSearch();

  const handleCreateDish = useCallback(async (dishData: CreateDishRequest) => {
    const result = await mutations.createDish(dishData);
    if (result) {
      await refetch(); // Atualiza a lista após criar
    }
    return result;
  }, [mutations.createDish, refetch]);

  const handleUpdateDish = useCallback(async (id: string, dishData: UpdateDishRequest) => {
    const result = await mutations.updateDish(id, dishData);
    if (result) {
      await refetch(); // Atualiza a lista após atualizar
    }
    return result;
  }, [mutations.updateDish, refetch]);

  const handleDeleteDish = useCallback(async (id: string) => {
    const result = await mutations.deleteDish(id);
    if (result) {
      await refetch(); // Atualiza a lista após deletar
    }
    return result;
  }, [mutations.deleteDish, refetch]);

  const handleToggleStatus = useCallback(async (id: string) => {
    const result = await mutations.toggleDishStatus(id);
    if (result) {
      await refetch(); // Atualiza a lista após alterar status
    }
    return result;
  }, [mutations.toggleDishStatus, refetch]);

  return {
    // Lista de pratos
    dishes,
    loading: loading || mutations.loading,
    error: error || mutations.error,
    refresh,
    refetch,

    // Operações CRUD
    createDish: handleCreateDish,
    updateDish: handleUpdateDish,
    deleteDish: handleDeleteDish,
    toggleDishStatus: handleToggleStatus,

    // Pesquisa
    search,
  };
};