import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from './styles';

/**
 * Componente focado APENAS em renderizar o cabeçalho da tela.
 */

export interface ManageDishesHeaderProps {
  onGoBack: () => void;
  onAddDish: () => void;
  title?: string;
}

export const ManageDishesHeader = React.memo<ManageDishesHeaderProps>(({
  onGoBack,
  onAddDish,
  title = 'Gerenciar Pratos',
}) => {
  const { colors } = useTheme();

  /**
   * Recalcula apenas quando colors mudam
   */
  const headerStyles = useMemo(() => ({
    container: [styles.header, { 
      backgroundColor: colors.background, 
      borderBottomColor: colors.divider 
    }],
    title: [styles.headerTitle, { color: colors.text }],
    addButtonText: [styles.addButtonText, { color: colors.text }],
  }), [colors]);

  return (
    <View style={headerStyles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity 
        style={styles.backButton} 
        activeOpacity={0.7}
        onPress={onGoBack}
        accessibilityLabel="Voltar"
        accessibilityRole="button"
      >
        <Feather name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={headerStyles.title}>{title}</Text>

      {/* Botão Adicionar */}
      <TouchableOpacity 
        style={styles.addButton} 
        activeOpacity={0.7}
        onPress={onAddDish}
        accessibilityLabel="Adicionar novo prato"
        accessibilityRole="button"
      >
        <Feather name="plus" size={20} color={colors.text} />
        <Text style={headerStyles.addButtonText}>Novo Prato</Text>
      </TouchableOpacity>
    </View>
  );
});

ManageDishesHeader.displayName = 'ManageDishesHeader';