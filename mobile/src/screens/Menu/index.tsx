import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

import { SafeScreen, CategoryFilter, MenuItemCard } from '../../components';
import { useDishStore } from '../../stores/dishStore';
import { useCartStore } from '../../stores/cartStore';
import { menuCategories } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import { DishCategory } from '../../types/models';
import { useToast } from '../../contexts/ToastContext';

interface MenuProps {
  navigation?: {
    navigate: (screen: string) => void;
  };
}

const Menu: React.FC<MenuProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { showSuccess } = useToast();
  
  // Zustand stores
  const { 
    dishes, 
    fetchDishes, 
    getDishesByCategory, 
    getActiveDishes,
    refreshDishes,
    loading,
  } = useDishStore();
  
  const { 
    addItem,
  } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);

  // Carrinho - usando store
  const addToCart = useCallback((itemId: number | string) => {
    const dish = dishes.find(d => d.id.toString() === itemId.toString());
    if (dish) {
      addItem(dish, 1);
      showSuccess(`${dish.name} adicionado ao carrinho!`);
    }
  }, [dishes, addItem, showSuccess]);

  // Carregar pratos ao montar o componente
  useEffect(() => {
    const loadDishes = async () => {
      try {
        await fetchDishes();
      } catch (error) {
        // Extrair mensagem específica do erro
        let errorMessage = 'Erro ao carregar pratos';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        Alert.alert('Erro', errorMessage);
      }
    };
    
    loadDishes();
  }, [fetchDishes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshDishes();
    } catch (error) {
      // Extrair mensagem específica do erro
      let errorMessage = 'Erro ao atualizar pratos';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [refreshDishes]);

  const handleManageDishes = () => {
    navigation?.navigate('ManageDishes');
  };

  // Mapear categorias do menu para categorias do banco de dados
  const mapCategoryToDb = (category: string): DishCategory => {
    switch (category) {
      case 'Bebidas':
        return 'DRINK';
      case 'Pratos Principais':
        return 'MAIN_COURSE';
      case 'Sobremesas':
        return 'DESSERT';
      default:
        return 'APPETIZER';
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
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeScreen>
      <Menu navigation={navigation} />
    </SafeScreen>
  );
};

export default MenuScreen;