import React, { useCallback, useMemo } from 'react';
import { FlatList, View, ListRenderItem, Text } from 'react-native';
import { LegacyOrderItem } from '../../../types/models';
import OrderItemCard from '../OrderItemCard/OrderItemCard';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from './styles';

/**
 * Lista otimizada de itens do pedido.
 */
export interface OrderItemsListProps {
  items: LegacyOrderItem[];
  onQuantityChange: (itemId: string, increment: boolean) => void;
}

const OrderItemsList = React.memo<OrderItemsListProps>(({ 
  items, 
  onQuantityChange 
}) => {
  const { colors } = useTheme();

  /**
   * Renderiza cada item da lista.
   * Memoizado para evitar re-criação desnecessária.
   */
  const renderItem: ListRenderItem<LegacyOrderItem> = useCallback(({ item }) => (
    <OrderItemCard
      item={item}
      onQuantityChange={onQuantityChange}
    />
  ), [onQuantityChange]);

  /**
   * Extrai chave única para cada item.
   * Otimiza performance do FlatList.
   */
  const keyExtractor = useCallback((item: LegacyOrderItem) => item.id.toString(), []);

  /**
   * Separador entre itens.
   * Memoizado para evitar re-criação.
   */
  const ItemSeparator = useMemo(() => () => (
    <View style={[styles.separator, { backgroundColor: colors.divider }]} />
  ), [colors.divider]);

  /**
   * Componente para exibir quando a lista está vazia
   */
  const EmptyListComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Escolha algum Prato para começar
      </Text>
    </View>
  ), []);

  /**
   * Otimização para getItemLayout - melhora performance em listas grandes
   */
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 96, // altura estimada do item
    offset: 96 * index,
    index,
  }), []);

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={EmptyListComponent}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={8}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
});

OrderItemsList.displayName = 'OrderItemsList';

export default OrderItemsList;
