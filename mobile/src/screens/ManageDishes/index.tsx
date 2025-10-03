import React, { useCallback } from 'react';
import { View } from 'react-native';
import { SafeScreen, ManageDishesHeader, DishList, DishModal } from '../../components';
import { useDishManagement } from '../../hooks/useDishManagement';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

interface ManageDishesProps {
  navigation?: any;
}

/**
 * Responsabilidade: Compor e coordenar outros componentes
 */
const ManageDishes: React.FC<ManageDishesProps> = ({ navigation }) => {
  const { colors } = useTheme();
  
  /**
   * Toda lógica de negócio abstraída no hook customizado
   */
  const {
    dishes,
    modalVisible,
    selectedDish,
    refreshing,
    handleAddDish,
    handleEditDish,
    handleDeleteDish,
    handleSaveDish,
    handleCloseModal,
    onRefresh,
  } = useDishManagement();

  /**
   * Evita re-criação da função
   */
  const handleGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header Component */}
      <ManageDishesHeader
        onGoBack={handleGoBack}
        onAddDish={handleAddDish}
      />

      {/* List Component */}
      <DishList
        dishes={dishes}
        onEditDish={handleEditDish}
        onDeleteDish={handleDeleteDish}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Modal Component */}
      <DishModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveDish}
        dish={selectedDish}
      />
    </View>
  );
};

/**
 * Responsabilidade: Aplicar SafeScreen e passar navigation
 */
const ManageDishesScreen: React.FC<ManageDishesProps> = ({ navigation }) => {
  return (
    <SafeScreen>
      <ManageDishes navigation={navigation} />
    </SafeScreen>
  );
};

export default ManageDishesScreen;