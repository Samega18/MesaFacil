import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui'; 
import { useTheme } from '../contexts/ThemeContext';

export function useSystemNavigationBar() {
  const { theme, colors } = useTheme();

  useEffect(() => {
    if (colors) {
      SystemUI.setBackgroundColorAsync(colors.background);
    }
  }, [theme, colors]);
}