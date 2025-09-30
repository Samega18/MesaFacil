// em /src/screens/Settings/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeScreen } from '../../components/SafeScreen';
import { typography, metrics } from '../../styles';
import { Button } from '../../components/Button';

function Settings() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
        <Button
          title={`Mudar para Modo ${theme === 'light' ? 'Escuro' : 'Claro'}`}
          onPress={toggleTheme}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.sm,
  },
  title: {
    ...typography.textStyles.h1,
    marginBottom: metrics.spacing.lg,
  },
});

function SettingsScreen() {
  return (
    <SafeScreen>
      <Settings />
    </SafeScreen>
  );
}

export default SettingsScreen;