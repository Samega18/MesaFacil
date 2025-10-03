import { AxiosResponse } from 'axios';
import { apiClient } from './apiConfig';
import {
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters,
  OrderStatistics,
  DashboardData,
  ApiResponse,
} from '../types/api';
import { OrderStatus } from '../types/models';

/**
 * Serviço para gerenciar operações relacionadas aos pedidos
 */
class OrderService {
  private readonly basePath = '/orders';

  /**
   * Lista todos os pedidos com filtros opcionais
   */
  async getOrders(filters?: OrderFilters): Promise<OrderResponse[]> {
    try {
      const params = this.buildQueryParams(filters);
      const response: AxiosResponse<ApiResponse<OrderResponse[]>> = await apiClient.get(
        this.basePath,
        { params }
      );
      
      // A API retorna { data: { data: [...], count: number, success: boolean } }
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pedidos');
    }
  }

  /**
   * Busca um pedido específico por ID
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await apiClient.get(
        `${this.basePath}/${id}`
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pedido');
    }
  }

  /**
   * Cria um novo pedido
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      // Validar dados antes de enviar
      this.validateOrderData(orderData);
      
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await apiClient.post(
        this.basePath,
        orderData
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao criar pedido');
    }
  }

  /**
   * Atualiza um pedido existente
   */
  async updateOrder(id: string, orderData: UpdateOrderRequest): Promise<OrderResponse> {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await apiClient.put(
        `${this.basePath}/${id}`,
        orderData
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao atualizar pedido');
    }
  }

  /**
   * Remove um pedido
   */
  async deleteOrder(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Erro ao remover pedido');
    }
  }

  /**
   * Atualiza apenas o status de um pedido
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResponse> {
    try {
      const response: AxiosResponse<ApiResponse<OrderResponse>> = await apiClient.patch(
        `${this.basePath}/${id}/status`,
        { status }
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao atualizar status do pedido');
    }
  }

  /**
   * Busca pedidos por status
   */
  async getOrdersByStatus(status: OrderStatus): Promise<OrderResponse[]> {
    try {
      const filters: OrderFilters = { status };
      return await this.getOrders(filters);
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pedidos por status');
    }
  }

  /**
   * Busca pedidos do dia atual
   */
  async getTodayOrders(): Promise<OrderResponse[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filters: OrderFilters = { 
        dateFrom: today,
        dateTo: today 
      };
      return await this.getOrders(filters);
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pedidos de hoje');
    }
  }

  /**
   * Busca pedidos pendentes (RECEIVED e PREPARING)
   */
  async getPendingOrders(): Promise<OrderResponse[]> {
    try {
      const receivedOrders = await this.getOrdersByStatus('RECEIVED');
      const preparingOrders = await this.getOrdersByStatus('PREPARING');
      
      return [...receivedOrders, ...preparingOrders].sort((a, b) => 
        new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      );
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar pedidos pendentes');
    }
  }

  /**
   * Busca estatísticas de pedidos
   */
  async getOrderStatistics(dateFrom?: string, dateTo?: string): Promise<OrderStatistics> {
    try {
      const params: Record<string, any> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response: AxiosResponse<ApiResponse<OrderStatistics>> = await apiClient.get(
        '/statistics/orders',
        { params }
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar estatísticas');
    }
  }

  /**
   * Busca dados do dashboard
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response: AxiosResponse<ApiResponse<DashboardData>> = await apiClient.get(
        '/statistics/dashboard'
      );
      
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Erro ao buscar dados do dashboard');
    }
  }

  /**
   * Avança o status do pedido para o próximo estágio
   */
  async advanceOrderStatus(id: string): Promise<OrderResponse> {
    try {
      const order = await this.getOrderById(id);
      const nextStatus = this.getNextStatus(order.status);
      
      if (!nextStatus) {
        throw new Error('Pedido já está no status final');
      }
      
      return await this.updateOrderStatus(id, nextStatus);
    } catch (error) {
      throw this.handleError(error, 'Erro ao avançar status do pedido');
    }
  }

  /**
   * Cancela um pedido (apenas se estiver em RECEIVED)
   */
  async cancelOrder(id: string): Promise<void> {
    try {
      const order = await this.getOrderById(id);
      
      if (order.status !== 'RECEIVED') {
        throw new Error('Apenas pedidos recebidos podem ser cancelados');
      }
      
      await this.deleteOrder(id);
    } catch (error) {
      throw this.handleError(error, 'Erro ao cancelar pedido');
    }
  }

  /**
   * Calcula o total de um pedido baseado nos itens
   */
  calculateOrderTotal(items: CreateOrderRequest['items']): number {
    // Em uma implementação real, é necessário buscar os preços da API
    return items.reduce((total, item) => {
      // O preço real deve vir do prato, não do item
      // Esta é uma implementação simplificada
      return total + (item.quantity * 0); // Preço será calculado no backend
    }, 0);
  }

  /**
   * Valida dados do pedido antes de enviar para a API
   */
  private validateOrderData(orderData: CreateOrderRequest): void {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Pedido deve conter pelo menos um item');
    }

    for (const item of orderData.items) {
      if (!item.dishId) {
        throw new Error('ID do prato é obrigatório');
      }
      
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
      }
    }
  }

  /**
   * Retorna o próximo status na sequência
   */
  private getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      'PENDING': 'PREPARING',
      'RECEIVED': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'DELIVERED',
      'DELIVERED': null,
      'CANCELLED': null,
    };

    return statusFlow[currentStatus];
  }

  /**
   * Constrói parâmetros de query para filtros
   */
  private buildQueryParams(filters?: OrderFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.minValue) params.minValue = filters.minValue;
    if (filters.maxValue) params.maxValue = filters.maxValue;
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
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error(defaultMessage);
  }
}

// Instância singleton do serviço
export const orderService = new OrderService();

// Export da classe para casos específicos
export { OrderService };