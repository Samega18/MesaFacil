import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeScreen } from '../../components/SafeScreen';
import { CreateOrderHeader } from '../../components/CreateOrderHeader';
import { OrderItemsList } from '../../components/OrderItemsList';
import { OrderSummary } from '../../components/OrderSummary';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useOrderManagement } from '../../hooks/useOrderManagement';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';


/**
 * Orquestrador principal da tela de criar pedido.
 * Compõe componentes especializados e coordena fluxo de dados.
 * Aplica SOLID: SRP, OCP, DIP.
 * Agora inclui funcionalidade de remoção de itens com confirmação.
 */
const CreateOrder: React.FC = () => {
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
  } = useOrderManagement();

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

const CreateOrderScreen: React.FC = () => {
  return (
    <SafeScreen>
      <CreateOrder />
    </SafeScreen>
  );
}

export default CreateOrderScreen;