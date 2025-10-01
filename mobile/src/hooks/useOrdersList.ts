import { useState, useCallback, useMemo, useEffect } from 'react';
import { Order, OrderStatus, OrderWithUI } from '../types/models';
import { useOrderStore } from '../stores/orderStore';

/**
 * Hook responsável pela lógica de negócio da lista de pedidos.
 * Aplica SRP: única responsabilidade de gerenciar estado e operações da lista.
 * Aplica DIP: abstrai fonte de dados, facilitando troca por API real.
 */
export const useOrdersList = () => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUI | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Zustand store
  const { 
    orders, 
    fetchOrders, 
    getOrdersByStatus,
    updateOrderStatusAsync 
  } = useOrderStore();

  // Carregar pedidos ao montar o componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Mapear filtros do menu para status do banco de dados
  const mapFilterToDbStatus = (filter: string): OrderStatus | null => {
    switch (filter) {
      case 'Recebido':
        return 'RECEIVED';
      case 'Em Preparo':
        return 'PREPARING';
      case 'Pronto':
        return 'READY';
      case 'Entregue':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  /**
   * Filtra pedidos baseado no filtro selecionado.
   * Memoizado para evitar recálculos desnecessários.
   */
  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'Todos') {
      return orders;
    }
    const dbStatus = mapFilterToDbStatus(selectedFilter);
    return dbStatus ? getOrdersByStatus(dbStatus) : [];
  }, [selectedFilter, orders, getOrdersByStatus]);

  /**
   * Executa refresh da lista de pedidos.
   * Chama a API real através do store.
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar pedidos:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchOrders]);

  /**
   * Manipula seleção de filtro.
   * Callback memoizado para otimizar performance.
   */
  const handleFilterSelect = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  /**
   * Manipula pressionar um pedido.
   * Abre o modal de atualização de status.
   */
  const handleOrderPress = useCallback((order: OrderWithUI) => {
    setSelectedOrder(order);
    setModalVisible(true);
  }, []);

  /**
   * Fecha o modal de atualização de status.
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedOrder(null);
  }, []);

  /**
   * Atualiza o status de um pedido.
   */
  const handleUpdateStatus = useCallback(async (orderId: string, status: OrderStatus, notes?: string) => {
    try {
      await updateOrderStatusAsync(orderId, status);
      // Se houver observações, podemos atualizar o pedido com as notas também
      if (notes) {
        // TODO: Implementar atualização de notas se necessário
        console.log('Notas adicionadas:', notes);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  }, [updateOrderStatusAsync]);

  return {
    // Estado
    selectedFilter,
    refreshing,
    filteredOrders,
    selectedOrder,
    modalVisible,
    
    // Ações
    handleRefresh,
    handleFilterSelect,
    handleOrderPress,
    handleCloseModal,
    handleUpdateStatus,
  };
};