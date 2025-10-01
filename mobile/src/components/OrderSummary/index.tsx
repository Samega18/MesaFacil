import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../contexts/ThemeContext';
import { orderStatus } from '../../utils/constants';
import { styles } from './styles';

/**
 * Resumo do pedido com seletor de status e total.
 * Responsabilidade única: exibir resumo e permitir confirmação.
 */
export interface OrderSummaryProps {
  total: number;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onConfirmOrder: () => void;
}

export const OrderSummary = React.memo<OrderSummaryProps>(({
  total,
  selectedStatus,
  onStatusChange,
  onConfirmOrder,
}) => {
  const { colors } = useTheme();

  /**
   * Estilos dinâmicos baseados no tema.
   * Recalcula apenas quando colors mudam.
   */
  const summaryStyles = useMemo(() => ({
    container: [styles.footerContent, { 
      backgroundColor: colors.background, 
      borderTopColor: colors.divider 
    }],
    statusContainer: [styles.statusContainer, { 
      backgroundColor: colors.background, 
      borderColor: colors.divider,
    }],
    statusPicker: [styles.statusPicker, { 
      color: colors.text,
    }],
    totalLabel: [styles.summaryLabel, { color: colors.text }],
    totalValue: [styles.summaryValue, { color: colors.text }],
    confirmButton: [styles.confirmButton, { backgroundColor: colors.primary }],
    confirmButtonText: [styles.confirmButtonText, { color: 'white' }],
  }), [colors]);

  /**
   * Formata valor monetário para exibição.
   * Padrão brasileiro com vírgula decimal.
   */
  const formattedTotal = useMemo(() => 
    `R$ ${total.toFixed(2).replace('.', ',')}`, 
    [total]
  );

  return (
    <View style={summaryStyles.container}>
      <View style={summaryStyles.statusContainer}>
        <Text style={[styles.statusLabel, { color: colors.text }]}>Status do Pedido:</Text>
        <Picker
          selectedValue={selectedStatus}
          style={summaryStyles.statusPicker}
          onValueChange={onStatusChange}
          dropdownIconColor={colors.text}
        >
          {orderStatus.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
      </View>
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={summaryStyles.totalLabel}>Total</Text>
        <Text style={summaryStyles.totalValue}>{formattedTotal}</Text>
      </View>
      
      <TouchableOpacity 
        style={summaryStyles.confirmButton}
        onPress={onConfirmOrder}
        activeOpacity={0.8}
      >
        <Text style={summaryStyles.confirmButtonText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
});

OrderSummary.displayName = 'OrderSummary';