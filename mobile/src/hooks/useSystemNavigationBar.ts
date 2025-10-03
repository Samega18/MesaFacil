import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui'; 
import { useTheme } from '../contexts/ThemeContext';

// Responsável por cuidar da cor de fundo da barra de navegação do sistema
// Aplica a cor de fundo baseada no tema atual
export function useSystemNavigationBar() {
  const { theme, colors } = useTheme();

  useEffect(() => {
    if (colors) {
      SystemUI.setBackgroundColorAsync(colors.background);
    }
  }, [theme, colors]);
}