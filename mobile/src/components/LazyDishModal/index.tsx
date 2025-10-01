import React, { lazy, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Dish } from '../../types/models';

// Lazy loading do DishModal
const DishModal = lazy(() => 
  import('../DishModal').then(module => ({ default: module.DishModal }))
);

interface LazyDishModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (dishData: Partial<Dish>) => void;
  dish: Dish | null;
}

/**
 * Componente de carregamento enquanto o modal é carregado
 */
const ModalLoadingFallback: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
};

/**
 * Só renderiza o modal quando visible=true
 */
export const LazyDishModal: React.FC<LazyDishModalProps> = (props) => {
  // Só renderiza quando o modal está visível
  if (!props.visible) {
    return null;
  }

  return (
    <Suspense fallback={<ModalLoadingFallback />}>
      <DishModal {...props} />
    </Suspense>
  );
};