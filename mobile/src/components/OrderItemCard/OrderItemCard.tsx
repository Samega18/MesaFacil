import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { useTheme } from '../../contexts/ThemeContext';
import { metrics, typography } from '../../styles';
import { LegacyOrderItem } from '../../types/models';
import { FallbackImage } from '../common/FallbackImage';

interface OrderItemCardProps {
  item: LegacyOrderItem;
  onQuantityChange: (itemId: string, increment: boolean) => void;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, onQuantityChange }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    orderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.xs,
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.md,
      backgroundColor: colors.background,
    },
    itemImage: {
      width: moderateScale(64),
      height: moderateScale(64),
      borderRadius: metrics.radius.input,
    },
    itemInfo: { flex: 1, paddingLeft: metrics.spacing.xs },
    itemName: {
      ...typography.textStyles.body1,
      fontFamily: typography.fonts.inter.semibold,
      color: colors.text,
      marginBottom: metrics.spacing.xs,
    },
    itemPrice: {
      ...typography.textStyles.body2,
      color: `${colors.primary}CC`,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.xs,
    },
    quantityButton: {
      width: metrics.spacing.xl,
      height: metrics.spacing.xl,
      borderRadius: metrics.spacing.md,
      backgroundColor: `${colors.primary}33`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonText: {
      ...typography.textStyles.h3,
      fontFamily: typography.fonts.inter.bold,
      color: colors.primary,
    },
    quantityText: {
      ...typography.textStyles.h3,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
      minWidth: moderateScale(28),
      textAlign: 'center',
    },
    itemTotal: {
      ...typography.textStyles.body1,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
      width: moderateScale(70),
      textAlign: 'right',
    },
  });

  return (
    <View style={styles.orderItem}>
      <FallbackImage 
        source={{ uri: item.image || '' }} 
        style={styles.itemImage} 
        resizeMode="cover"
        fallbackIcon="image"
        fallbackSize={24}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name || 'Item sem nome'}</Text>
        <Text style={styles.itemPrice}>
          R$ {(item.price || 0).toFixed(2).replace('.', ',')}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => onQuantityChange(item.id.toString(), false)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity || 0}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => onQuantityChange(item.id.toString(), true)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>
        R$ {((item.price || 0) * (item.quantity || 0)).toFixed(2).replace('.', ',')}
      </Text>
    </View>
  );
};