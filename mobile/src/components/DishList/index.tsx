import React, { useCallback, useMemo } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import { DishCard } from '../DishCard';
import { Dish } from '../../types/models';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

/**
 * Componente focado APENAS em renderizar a lista de pratos.
 */

export interface DishListProps {
  dishes: Dish[];
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dish: Dish) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export const DishList = React.memo<DishListProps>(({
  dishes,
  onEditDish,
  onDeleteDish,
  refreshing,
  onRefresh,
}) => {
  const { colors, theme } = useTheme();

  /**
   * Evita re-criação da função a cada render
   */
  const renderDishItem = useCallback(({ item }: { item: Dish }) => (
    <DishCard
      dish={item}
      onEdit={onEditDish}
      onDelete={onDeleteDish}
      colors={colors}
      theme={theme}
    />
  ), [onEditDish, onDeleteDish, colors, theme]);

  /**
   * Melhora performance da FlatList
   */
  const keyExtractor = useCallback((item: Dish) => item.id.toString(), []);

  /**
   * Evita re-criação do componente
   */
  const ItemSeparatorComponent = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  /**
   * Recria apenas quando necessário
   */
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  ), [refreshing, onRefresh, colors.primary]);

  /**
   * Permite scroll mais fluido em listas grandes
   */
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 88, // altura do item + separator
    offset: 88 * index,
    index,
  }), []);

  return (
    <FlatList
      data={dishes}
      keyExtractor={keyExtractor}
      renderItem={renderDishItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      
      // Performance: Otimizações avançadas da FlatList
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={8}
      windowSize={10}
      getItemLayout={getItemLayout}
      
      accessibilityLabel="Lista de pratos"
      accessibilityRole="list"
    />
  );
});

DishList.displayName = 'DishList';