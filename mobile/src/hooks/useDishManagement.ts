import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { Dish } from '../types/models';
import { CreateDishRequest, UpdateDishRequest } from '../types/api';
import { useDishStore } from '../stores/dishStore';
import { useToast } from '../contexts/ToastContext';

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
  handleSaveDish: (dishData: CreateDishRequest | UpdateDishRequest) => Promise<void>;
  handleCloseModal: () => void;
  onRefresh: () => void;
}

export const useDishManagement = (): DishManagementState & DishManagementActions => {
  const { showSuccess } = useToast();

  // Integração com dishStore
  const { 
    dishes, 
    loading, 
    error, 
    createDish,
    updateDish,
    deleteDish,
    fetchDishes,
    refreshDishes
  } = useDishStore();

  // Estados locais para UI
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Carregar dados da API na inicialização
  useEffect(() => {
    if (dishes.length === 0) {
      fetchDishes();
    }
  }, [dishes.length, fetchDishes]);

  /**
   * Abre modal para adicionar novo prato
   */
  const handleAddDish = useCallback(() => {
    setSelectedDish(null);
    setModalVisible(true);
  }, []);

  /**
   * Abre modal para editar prato existente
   */
  const handleEditDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  }, []);

  /**
   *  UX: Confirmação antes de excluir
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
              showSuccess('Prato excluído com sucesso!');
            } catch (error) {
              // Extrair mensagem específica do erro
              let errorMessage = 'Não foi possível excluir o prato';
              
              if (error instanceof Error) {
                errorMessage = error.message;
              } else if (typeof error === 'string') {
                errorMessage = error;
              }
              
              Alert.alert('Erro', errorMessage);
            }
          },
        },
      ]
    );
  }, [deleteDish]);

   /**
   * Fecha modal e limpa estado
   */
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedDish(null);
  }, []);

  /**
   * Lógica centralizada para criar/editar pratos
   */
  const handleSaveDish = useCallback(async (dishData: CreateDishRequest | UpdateDishRequest) => {
    try {
      if (selectedDish) {
        // Editar prato existente
        await updateDish(selectedDish.id, dishData as UpdateDishRequest);
        showSuccess('Prato editado com sucesso!');
      } else {
        // Criar novo prato
        await createDish(dishData as CreateDishRequest);
        showSuccess('Prato adicionado com sucesso!');
      }
      
      // Fechar modal após salvar com sucesso
      handleCloseModal();
    } catch (error) {
      // Extrair mensagem específica do erro
      let errorMessage = 'Não foi possível salvar o prato';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      Alert.alert('Erro', errorMessage);
      // Re-throw para permitir que o componente saiba que houve erro
      throw error;
    }
  }, [selectedDish, updateDish, createDish, handleCloseModal]);

  /**
   * Usa a API para buscar dados atualizados
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Recarregar dados da API
      await refreshDishes();
    } catch (error) {
      // Extrair mensagem específica do erro
      let errorMessage = 'Não foi possível recarregar os dados';
      
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