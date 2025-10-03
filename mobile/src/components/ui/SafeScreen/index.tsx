import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts/ThemeContext';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeScreen: React.FC<SafeScreenProps> = ({ children, style }) => {
  const { theme, colors } = useTheme();
  
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.background }, style]}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} backgroundColor={colors.background} translucent={false} />
      {children}
    </SafeAreaView>
  );
}

export default SafeScreen;