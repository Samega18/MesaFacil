import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { OrderStatus, OrderWithUI } from '../types/models';
import { useOrderStore } from '../stores/orderStore';
import { useToast } from '../contexts/ToastContext';

/**
 * Hook responsável pela lógica de negócio da lista de pedidos.
 */
export const useOrdersList = () => {
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUI | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { showSuccess } = useToast();

  // Zustand store
  const { 
    orders, 
    fetchOrders, 
    getOrdersByStatus,
    updateOrderStatusAsync,
    deleteOrder
  } = useOrderStore();

  // Carregar pedidos ao montar o componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Atualizar pedidos quando a tela recebe foco (após criar um novo pedido)
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

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
  const handleUpdateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusAsync(orderId, status);
      // Fechar o modal após atualização bem-sucedida
      setModalVisible(false);
      setSelectedOrder(null);
      showSuccess('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  }, [updateOrderStatusAsync, showSuccess]);

  /**
   * Deleta um pedido.
   */
  const handleDeleteOrder = useCallback(async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      // Fechar o modal após exclusão bem-sucedida
      setModalVisible(false);
      setSelectedOrder(null);
      showSuccess('Pedido excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
    }
  }, [deleteOrder, showSuccess]);

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
    handleDeleteOrder,
  };
};