import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeScreen, CreateOrderHeader, OrderItemsList, OrderSummary, ConfirmationModal } from '../../components';
import { useOrderManagement } from '../../hooks/useOrderManagement';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

interface CreateOrderProps {
  navigation?: any;
}

/**
 * Orquestrador principal da tela de criar pedido.
 * Compõe componentes especializados e coordena fluxo de dados.
 */
const CreateOrder: React.FC<CreateOrderProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    selectedStatus,
    orderItems,
    pendingRemoval,
    setSelectedStatus,
    updateQuantity,
    confirmOrder,
    confirmRemoveItem,
    cancelRemoveItem,
    total,
  } = useOrderManagement(navigation);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.keyboardAvoid}
      >
        <CreateOrderHeader />
        
        <OrderItemsList
          items={orderItems}
          onQuantityChange={updateQuantity}
        />
        
        <OrderSummary
          total={total}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onConfirmOrder={confirmOrder}
        />

        {/* Modal de confirmação para remoção de itens */}
        <ConfirmationModal
          visible={!!pendingRemoval}
          title="Remover item do pedido?"
          message={`Deseja remover "${pendingRemoval?.itemName}" do seu pedido?`}
          confirmText="Remover"
          cancelText="Manter"
          confirmButtonColor="danger"
          onConfirm={confirmRemoveItem}
          onCancel={cancelRemoveItem}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const CreateOrderScreen: React.FC<CreateOrderProps> = ({ navigation }) => {
  return (
    <SafeScreen>
      <CreateOrder navigation={navigation} />
    </SafeScreen>
  );
};

export default CreateOrderScreen;