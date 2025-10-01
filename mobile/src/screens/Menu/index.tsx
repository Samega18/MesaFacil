import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeScreen } from '../../components/SafeScreen';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

import { useDishStore } from '../../stores/dishStore';
import { useCartStore } from '../../stores/cartStore';
import { menuCategories } from '../../utils/constants';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import MenuItemCard from '../../components/MenuItemCard/MenuItemCard';
import { useTheme } from '../../contexts/ThemeContext';
import { DishCategory } from '../../types/models';
import { Toast } from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

interface MenuProps {
  navigation?: any;
}

const Menu: React.FC<MenuProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { toast, showSuccess, hideToast } = useToast();
  
  // Zustand stores
  const { 
    dishes, 
    fetchDishes, 
    getDishesByCategory, 
    getActiveDishes 
  } = useDishStore();
  
  const { 
    addItem, 
    getTotalItems 
  } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);

  // Carrinho - usando store
  const cartCount = getTotalItems();
  const addToCart = useCallback((itemId: number | string) => {
    const dish = dishes.find(d => d.id.toString() === itemId.toString());
    if (dish) {
      addItem(dish, 1);
      showSuccess(`${dish.name} adicionado ao carrinho!`);
    }
  }, [dishes, addItem, showSuccess]);

  // Carregar pratos ao montar o componente
  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDishes();
    } catch (error) {
      console.error('Erro ao atualizar pratos:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchDishes]);

  const handleManageDishes = () => {
    navigation?.navigate('ManageDishes');
  };

  // Mapear categorias do menu para categorias do banco de dados
  const mapCategoryToDb = (category: string): DishCategory => {
    switch (category) {
      case 'Bebidas':
        return 'BEVERAGE';
      case 'Pratos Principais':
        return 'MAIN_COURSE';
      case 'Sobremesas':
        return 'DESSERT';
      default:
        return 'MAIN_COURSE';
    }
  };

  // Filtrar pratos baseado na categoria selecionada
  const filteredItems = selectedCategory === 'Todos' 
    ? getActiveDishes() 
    : (() => {
        const dbCategory = mapCategoryToDb(selectedCategory);
        return getDishesByCategory(dbCategory);
      })();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
        <TouchableOpacity 
          style={styles.refreshButton}
          activeOpacity={0.7}
          onPress={onRefresh}
        >
          <Feather name="refresh-cw" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cardápio</Text>
        <TouchableOpacity 
          style={styles.searchButton} 
          activeOpacity={0.7}
          onPress={handleManageDishes}
        >
          <Feather name="edit" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
          <CategoryFilter
            categories={menuCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
      </View>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItemCard 
            item={item} 
            onAddToCart={addToCart} 
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
      
      {/* Toast Component */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const MenuScreen: React.FC = ({ navigation }: any) => {
  return (
    <SafeScreen>
      <Menu navigation={navigation} />
    </SafeScreen>
  );
}

export default MenuScreen;