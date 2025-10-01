import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { Dish } from '../types/models';
import { useDishStore } from '../stores/dishStore';

export interface DishManagementState {
  dishes: Dish[];
  modalVisible: boolean;
  selectedDish: Dish | null;
  refreshing: boolean;
  loading: boolean;
  error: string | null;
}

export interface DishManagementActions {
  handleAddDish: () => void;
  handleEditDish: (dish: Dish) => void;
  handleDeleteDish: (dish: Dish) => void;
  handleSaveDish: (dishData: Partial<Dish>) => void;
  handleCloseModal: () => void;
  onRefresh: () => void;
}

export const useDishManagement = (): DishManagementState & DishManagementActions => {
  // Integração com dishStore
  const { 
    dishes, 
    loading, 
    error, 
    addDish, 
    updateDish, 
    removeDish, 
    createDish, 
    updateDishAsync, 
    deleteDish,
    loadMockData 
  } = useDishStore();

  // Estados locais para UI
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Carregar dados mock na inicialização se necessário
  useEffect(() => {
    if (dishes.length === 0) {
      loadMockData();
    }
  }, [dishes.length, loadMockData]);

  /**
   * 🚀 Performance: useCallback para evitar re-renders desnecessários
   * Abre modal para adicionar novo prato
   */
  const handleAddDish = useCallback(() => {
    setSelectedDish(null);
    setModalVisible(true);
  }, []);

  /**
   * 🚀 Performance: useCallback memoizado
   * Abre modal para editar prato existente
   */
  const handleEditDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  }, []);

  /**
   * 🛡️ UX: Confirmação antes de excluir
   * 🚀 Performance: useCallback para estabilidade de referência
   */
  const handleDeleteDish = useCallback(async (dish: Dish) => {
    Alert.alert(
      'Excluir Prato',
      `Tem certeza que deseja excluir "${dish.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDish(dish.id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o prato');
            }
          },
        },
      ]
    );
  }, [deleteDish]);

  /**
   * 🎯 SOLID: Single Responsibility - função focada apenas em salvar
   * Lógica centralizada para criar/editar pratos
   */
  const handleSaveDish = useCallback(async (dishData: Partial<Dish>) => {
    try {
      if (selectedDish) {
        // Editar prato existente
        await updateDishAsync(selectedDish.id, dishData);
      } else {
        // Criar novo prato
        const newDishData = {
          name: dishData.name!,
          description: dishData.description!,
          price: dishData.price!,
          category: dishData.category!,
          active: dishData.active || true,
          image: dishData.image || 'https://via.placeholder.com/150',
        };
        await createDish(newDishData);
      }
      
      // Fechar modal após salvar
      handleCloseModal();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o prato');
    }
  }, [selectedDish, updateDishAsync, createDish]);

  /**
   * 🚀 Performance: useCallback para estabilidade
   * Fecha modal e limpa estado
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedDish(null);
  }, []);

  /**
   * 🔄 Refresh: Recarrega dados do store
   * Em produção, faria chamada para API
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Recarregar dados mock ou fazer chamada para API
      loadMockData();
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível recarregar os dados');
    } finally {
      setRefreshing(false);
    }
  }, [loadMockData]);

  return {
    // Estado
    dishes,
    modalVisible,
    selectedDish,
    refreshing,
    loading,
    error,
    // Ações
    handleAddDish,
    handleEditDish,
    handleDeleteDish,
    handleSaveDish,
    handleCloseModal,
    onRefresh,
  };
};