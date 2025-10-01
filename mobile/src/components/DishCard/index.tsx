import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Dish } from '../../types/models';
import { FallbackImage } from '../common/FallbackImage';
import { styles } from './styles';

/**
 * 
 * Componente focado APENAS em renderizar um card de prato.
 */

export interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
  colors: any;
  theme: string;
}

/**
 * Só re-renderiza se as props mudarem
 */
export const DishCard = React.memo<DishCardProps>(({ 
  dish, 
  onEdit, 
  onDelete, 
  colors, 
  theme 
}) => {
  /**
   * Recalcula apenas quando colors ou theme mudam
   */
  const cardStyles = useMemo(() => ({
    container: [styles.dishCard, { 
      backgroundColor: colors.background,
      borderColor: colors.divider,
    }],
    dishImage: styles.dishImage,
    dishInfo: styles.dishInfo,
    dishName: [styles.dishName, { color: colors.text }],
    dishCategory: [styles.dishCategory, { color: colors.textSecondary }],
    dishPrice: [styles.dishPrice, { color: colors.secondary }],
    actionsContainer: styles.actionsContainer,
    editButton: [styles.actionButton, { 
      backgroundColor: theme === 'dark' ? colors.divider : '#F5F5F5'
    }],
    deleteButton: [styles.actionButton, { 
      backgroundColor: `${colors.primary}33` // 20% opacity
    }],
  }), [colors, theme]);

  const handleEdit = () => onEdit(dish);
  const handleDelete = () => onDelete(dish);

  return (
    <View style={cardStyles.container}>
      {/* 🖼️ Imagem do Prato */}
      <FallbackImage
        source={{ uri: dish.image || '' }}
        style={cardStyles.dishImage}
        resizeMode="cover"
        fallbackIcon="image"
        fallbackSize={24}
      />

      {/* 📝 Informações do Prato */}
      <View style={cardStyles.dishInfo}>
        <Text style={cardStyles.dishName} numberOfLines={1}>
          {dish.name}
        </Text>
        <Text style={cardStyles.dishCategory} numberOfLines={1}>
          Categoria: {dish.category}
        </Text>
        <Text style={cardStyles.dishPrice}>
          R$ {dish.price.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {/* ⚡ Ações do Card */}
      <View style={cardStyles.actionsContainer}>
        <TouchableOpacity
          style={cardStyles.editButton}
          onPress={handleEdit}
          activeOpacity={0.7}
          accessibilityLabel={`Editar prato ${dish.name}`}
          accessibilityRole="button"
        >
          <Feather 
            name="edit" 
            size={16} 
            color={theme === 'dark' ? colors.text : '#666666'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={cardStyles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
          accessibilityLabel={`Excluir prato ${dish.name}`}
          accessibilityRole="button"
        >
          <Feather name="trash-2" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

DishCard.displayName = 'DishCard';