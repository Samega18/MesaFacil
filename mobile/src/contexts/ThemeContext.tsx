import React, { createContext, useState, useContext, useMemo } from 'react';
import { lightColors, darkColors } from '../styles/colors';
import { useColorScheme } from 'react-native';

// Define o tipo de dados que nosso contexto irá fornecer
interface ThemeContextData {
  theme: 'light' | 'dark';
  colors: typeof lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Usa o tema do sistema como padrão inicial
  const deviceTheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(deviceTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // `useMemo` garante que o objeto de cores só seja recalculado quando o tema mudar
  const colors = useMemo(() => (theme === 'light' ? lightColors : darkColors), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook customizado para facilitar o uso do nosso contexto
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}