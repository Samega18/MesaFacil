import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useSystemNavigationBar } from './src/hooks/useSystemNavigationBar';
import { AppNavigator } from './src/navigation';
import { ActivityIndicator, View } from 'react-native';

// Importa o teste de mock data para desenvolvimento
import './src/tests/mockStoreTest';

/**
 * Este componente existe APENAS para garantir que os hooks que usam 
 * contextos (como o useSystemNavigationBar) sejam chamados DENTRO 
 * dos seus respectivos Providers.
 */
function AppContent() {
  useSystemNavigationBar();

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}