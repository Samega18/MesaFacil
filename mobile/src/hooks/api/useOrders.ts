import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { getErrorMessage } from '../../services/errorHandler';
import {
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters,
  OrderStatistics,
  DashboardData,
} from '../../types/api';
import { OrderStatus } from '../../types/models';

/**
 * Hook para listar pedidos com filtros
 */
export const useOrders = (filters?: OrderFilters) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const data = await orderService.getOrders(filters);
      setOrders(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrders.fetchOrders');
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders(false);
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshing,
    refresh,
    refetch: fetchOrders,
  };
};

/**
 * Hook para buscar um pedido específico
 */
export const useOrder = (id: string | null) => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrder.fetchOrder');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
};

/**
 * Hook para operações de criação, atualização e exclusão de pedidos
 */
export const useOrderMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (orderData: CreateOrderRequest): Promise<OrderResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const newOrder = await orderService.createOrder(orderData);
      return newOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.createOrder');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (id: string, orderData: UpdateOrderRequest): Promise<OrderResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedOrder = await orderService.updateOrder(id, orderData);
      return updatedOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.updateOrder');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await orderService.deleteOrder(id);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.deleteOrder');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus): Promise<OrderResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      return updatedOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.updateOrderStatus');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const advanceOrderStatus = useCallback(async (id: string): Promise<OrderResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedOrder = await orderService.advanceOrderStatus(id);
      return updatedOrder;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.advanceOrderStatus');
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await orderService.cancelOrder(id);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderMutations.cancelOrder');
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    advanceOrderStatus,
    cancelOrder,
    loading,
    error,
  };
};

/**
 * Hook para buscar pedidos por status
 */
export const useOrdersByStatus = (status: OrderStatus | null) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdersByStatus = useCallback(async () => {
    if (!status) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getOrdersByStatus(status);
      setOrders(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrdersByStatus.fetchOrdersByStatus');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrdersByStatus();
  }, [fetchOrdersByStatus]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrdersByStatus,
  };
};

/**
 * Hook para buscar pedidos pendentes
 */
export const usePendingOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getPendingOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'usePendingOrders.fetchPendingOrders');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchPendingOrders,
  };
};

/**
 * Hook para buscar pedidos de hoje
 */
export const useTodayOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getTodayOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useTodayOrders.fetchTodayOrders');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayOrders();
  }, [fetchTodayOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchTodayOrders,
  };
};

/**
 * Hook para estatísticas de pedidos
 */
export const useOrderStatistics = (dateFrom?: string, dateTo?: string) => {
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getOrderStatistics(dateFrom, dateTo);
      setStatistics(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useOrderStatistics.fetchStatistics');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};

/**
 * Hook para dados do dashboard
 */
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'useDashboard.fetchDashboardData');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

/**
 * Hook combinado para gerenciamento completo de pedidos
 */
export const useOrderManager = (initialFilters?: OrderFilters) => {
  const { orders, loading, error, refresh, refetch } = useOrders(initialFilters);
  const mutations = useOrderMutations();

  const handleCreateOrder = useCallback(async (orderData: CreateOrderRequest) => {
    const result = await mutations.createOrder(orderData);
    if (result) {
      await refetch(); // Atualiza a lista após criar
    }
    return result;
  }, [mutations.createOrder, refetch]);

  const handleUpdateOrder = useCallback(async (id: string, orderData: UpdateOrderRequest) => {
    const result = await mutations.updateOrder(id, orderData);
    if (result) {
      await refetch(); // Atualiza a lista após atualizar
    }
    return result;
  }, [mutations.updateOrder, refetch]);

  const handleDeleteOrder = useCallback(async (id: string) => {
    const result = await mutations.deleteOrder(id);
    if (result) {
      await refetch(); // Atualiza a lista após deletar
    }
    return result;
  }, [mutations.deleteOrder, refetch]);

  const handleUpdateStatus = useCallback(async (id: string, status: OrderStatus) => {
    const result = await mutations.updateOrderStatus(id, status);
    if (result) {
      await refetch(); // Atualiza a lista após alterar status
    }
    return result;
  }, [mutations.updateOrderStatus, refetch]);

  const handleAdvanceStatus = useCallback(async (id: string) => {
    const result = await mutations.advanceOrderStatus(id);
    if (result) {
      await refetch(); // Atualiza a lista após avançar status
    }
    return result;
  }, [mutations.advanceOrderStatus, refetch]);

  const handleCancelOrder = useCallback(async (id: string) => {
    const result = await mutations.cancelOrder(id);
    if (result) {
      await refetch(); // Atualiza a lista após cancelar
    }
    return result;
  }, [mutations.cancelOrder, refetch]);

  return {
    // Lista de pedidos
    orders,
    loading: loading || mutations.loading,
    error: error || mutations.error,
    refresh,
    refetch,

    // Operações CRUD
    createOrder: handleCreateOrder,
    updateOrder: handleUpdateOrder,
    deleteOrder: handleDeleteOrder,
    updateOrderStatus: handleUpdateStatus,
    advanceOrderStatus: handleAdvanceStatus,
    cancelOrder: handleCancelOrder,
  };
};