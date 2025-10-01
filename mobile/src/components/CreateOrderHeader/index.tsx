import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

/**
 * Header específico para tela de criar pedido.
 */
export interface CreateOrderHeaderProps {
  title?: string;
}

export const CreateOrderHeader = React.memo<CreateOrderHeaderProps>(({ 
  title = 'Criar Pedido' 
}) => {
  const { colors } = useTheme();

  /**
   * Estilos dinâmicos baseados no tema.
   * Recalcula apenas quando colors mudam.
   */
  const headerStyles = useMemo(() => ({
    container: [styles.header, { 
      backgroundColor: colors.background, 
      borderBottomColor: colors.divider 
    }],
    title: [styles.headerTitle, { color: colors.text }],
  }), [colors]);

  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.title}>{title}</Text>
    </View>
  );
});

CreateOrderHeader.displayName = 'CreateOrderHeader';