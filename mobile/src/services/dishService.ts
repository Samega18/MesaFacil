import { AxiosResponse } from 'axios';
import { apiClient } from './apiConfig';
import {
  DishResponse,
  CreateDishRequest,
  UpdateDishRequest,
  DishFilters,
} from '../types/api';

/**
 * Serviço para gerenciar operações relacionadas aos pratos
 */
class DishService {
  private readonly basePath = '/dishes';

  /**
   * Lista todos os pratos com filtros opcionais
   */
  async getDishes(filters?: DishFilters): Promise<DishResponse[]> {
    try {
      const params = this.buildQueryParams(filters);
      const response: AxiosResponse<DishResponse[]> = await apiClient.get(
        this.basePath,
        { params }
      );
      
      // Converte price de string para number
      const dishes = response.data.map(dish => ({
        ...dish,
        price: typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price
      }));
      
      return dishes;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pratos');
    }
  }

  /**
   * Busca um prato específico por ID
   */
  async getDishById(id: string): Promise<DishResponse> {
    try {
      const response: AxiosResponse<DishResponse> = await apiClient.get(
        `${this.basePath}/${id}`
      );
      
      // Converte price de string para number
      const dish = {
        ...response.data,
        price: typeof response.data.price === 'string' ? parseFloat(response.data.price) : response.data.price
      };
      
      return dish;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar prato');
    }
  }

  /**
   * Cria um novo prato
   */
  async createDish(dishData: CreateDishRequest): Promise<DishResponse> {
    try {
      const response: AxiosResponse<DishResponse> = await apiClient.post(
        this.basePath,
        dishData
      );
      
      // Converte price de string para number
      const dish = {
        ...response.data,
        price: typeof response.data.price === 'string' ? parseFloat(response.data.price) : response.data.price
      };
      
      return dish;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar prato');
    }
  }

  /**
   * Atualiza um prato existente
   */
  async updateDish(id: string, dishData: UpdateDishRequest): Promise<DishResponse> {
    try {
      const response: AxiosResponse<DishResponse> = await apiClient.put(
        `${this.basePath}/${id}`,
        dishData
      );
      
      // Converte price de string para number
      const dish = {
        ...response.data,
        price: typeof response.data.price === 'string' ? parseFloat(response.data.price) : response.data.price
      };
      
      return dish;
    } catch (error) {
      throw this.handleError(error, 'Erro ao atualizar prato');
    }
  }

  /**
   * Remove um prato
   */
  async deleteDish(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Erro ao remover prato');
    }
  }

  /**
   * Busca pratos por categoria
   */
  async getDishesByCategory(category: string): Promise<DishResponse[]> {
    try {
      const filters: DishFilters = { category: category as any };
      return await this.getDishes(filters);
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pratos por categoria');
    }
  }

  /**
   * Busca pratos ativos
   */
  async getActiveDishes(): Promise<DishResponse[]> {
    try {
      const filters: DishFilters = { active: true };
      return await this.getDishes(filters);
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pratos ativos');
    }
  }

  /**
   * Pesquisa pratos por nome ou descrição
   */
  async searchDishes(searchTerm: string): Promise<DishResponse[]> {
    try {
      const filters: DishFilters = { search: searchTerm };
      return await this.getDishes(filters);
    } catch (error) {
      throw this.handleError(error, 'Erro ao pesquisar pratos');
    }
  }

  /**
   * Alterna o status ativo/inativo de um prato
   */
  async toggleDishStatus(id: string): Promise<DishResponse> {
    try {
      // Primeiro busca o prato atual
      const currentDish = await this.getDishById(id);
      
      // Atualiza apenas o status
      const updateData: UpdateDishRequest = {
        active: !currentDish.active
      };
      
      return await this.updateDish(id, updateData);
    } catch (error) {
      throw this.handleError(error, 'Erro ao alterar status do prato');
    }
  }



  /**
   * Constrói parâmetros de query para filtros
   */
  private buildQueryParams(filters?: DishFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.category) params.category = filters.category;
    if (filters.active !== undefined) params.active = filters.active;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return params;
  }

  /**
   * Trata erros da API e retorna mensagem amigável
   */
  private handleError(error: any, defaultMessage: string): Error {
    
    // Prioridade 1: Verificar estrutura de dados do backend
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Detalhes de validação (do middleware express-validator) - PRIORIDADE MÁXIMA
      if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        const validationMessages = errorData.details.map((detail: any) => {
          return detail.message || detail.msg || 'Erro de validação';
        });
        const combinedMessage = validationMessages.join('\n• ');
        const finalMessage = `Erros de validação:\n• ${combinedMessage}`;
        return new Error(finalMessage);
      }
      
      // Mensagem específica do backend
      if (errorData.message) {
        return new Error(errorData.message);
      }
      
      // Mensagem de erro genérica
      if (errorData.error) {
        return new Error(errorData.error);
      }
    }''
    
    // Prioridade 2: Mensagem de erro HTTP baseada no status
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return new Error('Dados inválidos. Verifique as informações e tente novamente.');
        case 404:
          return new Error('Prato não encontrado.');
        case 409:
          return new Error('Já existe um prato com este nome.');
        case 500:
          return new Error('Erro interno do servidor. Tente novamente mais tarde.');
        default:
          return new Error(`Erro ${error.response.status}: ${error.response.statusText || 'Erro desconhecido'}`);
      }
    }
    
    // Prioridade 3: Mensagem de erro da requisição
    if (error.message) {
      return new Error(error.message);
    }
    
    // Prioridade 4: Mensagem padrão
    return new Error(defaultMessage);
  }
}

// Instância singleton do serviço
export const dishService = new DishService();

// Export da classe para casos específicos
export { DishService };