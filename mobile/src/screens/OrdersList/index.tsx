import React, { useCallback } from 'react';
import { View, FlatList, RefreshControl, ListRenderItem, TouchableOpacity, Text } from 'react-native';
import { SafeScreen, OrdersFilter, OrderCard, UpdateStatusModal } from '../../components';
import { useOrdersList } from '../../hooks/useOrdersList';
import { orderFilters } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import { OrderWithUI } from '../../types/models';
import { styles } from './styles';
import { Feather } from '@expo/vector-icons';

/**
 * Componente principal da lista de pedidos.
 */
const OrdersList: React.FC = () => {
  const { colors } = useTheme();

  const {
    selectedFilter,
    refreshing,
    filteredOrders,
    selectedOrder,
    modalVisible,
    handleRefresh,
    handleFilterSelect,
    handleOrderPress,
    handleCloseModal,
    handleUpdateStatus,
    handleDeleteOrder,
  } = useOrdersList();

  /**
   * Renderiza cada item da lista de pedidos.
   * Memoizado para evitar re-criação desnecessária.
   */
  const renderOrderItem: ListRenderItem<OrderWithUI> = useCallback(({ item }) => (
    <OrderCard 
      order={item} 
      onPress={handleOrderPress}
    />
  ), [handleOrderPress]);

  /**
   * Extrai chave única para cada pedido.
   * Otimiza performance do FlatList.
   */
  const keyExtractor = useCallback((item: OrderWithUI) => item.id.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
        <View style={styles.headerPlaceholder} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pedidos</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          activeOpacity={0.7}
          onPress={handleRefresh}
        >
          <Feather name="refresh-cw" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <OrdersFilter
        data={orderFilters}
        selectedValue={selectedFilter}
        onSelect={handleFilterSelect}
      />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />

      {/* Modal de Atualização de Status */}
      <UpdateStatusModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
      />
    </View>
  );
};


const OrdersListScreen: React.FC = () => {
  return (
    <SafeScreen>
      <OrdersList />
    </SafeScreen>
  );
}

export default OrdersListScreen;
