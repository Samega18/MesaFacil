import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; 

import { useTheme } from '../../contexts/ThemeContext';
import { metrics, typography } from '../../styles';
import { Dish } from '../../types/models';
import { FallbackImage } from '../common/FallbackImage';

// Interface para as props do nosso componente
interface MenuItemCardProps {
  item: Dish;
  onAddToCart: (id: number | string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: metrics.spacing.md,
      padding: metrics.spacing.md,
      borderRadius: metrics.radius.input,
      backgroundColor: colors.background,
      ...metrics.shadows.card,
      borderColor: colors.divider,
      borderWidth: .5,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      ...typography.textStyles.body2,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
      marginBottom: metrics.spacing.sm,
    },
    description: {
      ...typography.textStyles.caption,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: metrics.spacing.md,
    },
    price: {
      ...typography.textStyles.caption,
      fontFamily: typography.fonts.inter.bold,
      color: colors.text,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: 96,
      height: 96,
      borderRadius: metrics.radius.input,
    },
    addButton: {
      position: 'absolute',
      bottom: -metrics.spacing.sm,
      right: -metrics.spacing.sm,
      width: metrics.spacing.xl,
      height: metrics.spacing.xl,
      borderRadius: metrics.spacing.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.price}>
          R$ {item.price.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.imageContainer}>
        <FallbackImage
          source={{ uri: item.image || '' }}
          style={styles.image}
          resizeMode="cover"
          fallbackIcon="image"
          fallbackSize={24}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => onAddToCart(item.id)}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuItemCard;