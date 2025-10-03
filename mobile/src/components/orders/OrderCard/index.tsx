import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { OrderWithUI } from '../../../types/models';
import { OrderStatusService } from '../../../services/orderStatusService';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDishStore } from '../../../stores/dishStore';
import { styles } from './styles';

/**
 * Props do componente OrderCard.
 */
interface OrderCardProps {
  order: OrderWithUI;
  onPress?: (order: OrderWithUI) => void;
}

/**
 * Componente responsável por renderizar um card de pedido.
 */
const OrderCard = React.memo<OrderCardProps>(({ order, onPress }) => {
  const { colors } = useTheme();
  const { dishes } = useDishStore();
  
  const statusColors = OrderStatusService.getStatusColors(order.status);

  const handlePress = () => {
    onPress?.(order);
  };

  // Formatar descrição dos itens
  const formatItemsDescription = () => {
    if (!order.items || order.items.length === 0) {
      return 'Sem itens';
    }

    // Agrupa itens por nome e soma as quantidades
    const itemsMap = order.items.reduce((acc, item) => {
      // Busca o prato pelo dish_id
      const dish = dishes.find(d => d.id === item.dish_id);
      const name = dish?.name || 'Item sem nome';
      const quantity = item.quantity || 1;
      
      if (acc[name]) {
        acc[name] += quantity;
      } else {
        acc[name] = quantity;
      }
      
      return acc;
    }, {} as Record<string, number>);

    // Converte para array e formata
    return Object.entries(itemsMap)
      .map(([name, quantity]) => `${quantity}x ${name}`)
      .join(', ');
  };

  // Formatar status para exibição
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'RECEIVED': 'Recebido',
      'PREPARING': 'Em Preparo',
      'READY': 'Pronto',
      'DELIVERED': 'Entregue',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colors.background, 
          borderColor: colors.divider 
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={[styles.orderNumber, { color: colors.text }]}>
            Pedido {order.orderNumber || `#${order.id}`}
          </Text>
          <Text style={[styles.orderDateTime, { color: colors.textSecondary }]}>
            {order.date || new Date(order.created_at || '').toLocaleDateString('pt-BR')} · {order.time || new Date(order.created_at || '').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: statusColors.bg }
        ]}>
          <Text style={[
            styles.statusText,
            { color: statusColors.text }
          ]}>
            {formatStatus(order.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.orderItems, { color: colors.textSecondary }]}>
        {formatItemsDescription()}
      </Text>
      
      <Text style={[styles.orderTotal, { color: colors.text }]}>
        R$ {Number(order.total || order.total_value || 0).toFixed(2).replace('.', ',')}
      </Text>
    </TouchableOpacity>
  );
});

export default OrderCard;