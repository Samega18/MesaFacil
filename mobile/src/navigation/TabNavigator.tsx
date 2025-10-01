import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { metrics, typography } from '../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenuStack } from './MenuStack';
import { OrdersStack } from './OrdersStack';
import { SettingsStack } from './SettingsStack';
import { CreateOrderStack } from './CreateOrderStack';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [insetsReady, setInsetsReady] = useState(false);

  // Força uma re-renderização quando os insets estão disponíveis
  useEffect(() => {
    // Pequeno delay para garantir que os insets foram calculados
    const timer = setTimeout(() => {
      setInsetsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Usa um valor mínimo padrão se os insets ainda não estão prontos
  const safeBottomInset = insetsReady && insets.bottom > 0 
    ? insets.bottom 
    : (Platform.OS === 'ios' ? 10 : 5);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          paddingBottom: safeBottomInset,
          height: (Platform.OS === 'ios' ? 90 : 70) + safeBottomInset,
          paddingTop: 10,
          ...metrics.shadows.card,
        },

        tabBarLabelStyle: {
          fontFamily: typography.fonts.inter.semibold,
          fontSize: typography.fontSizes.caption,
        },
      }}
    >
      <Tab.Screen
        name="MenuTab"
        component={MenuStack}
        options={{
          title: 'Cardápio',
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Carrinho"
        component={CreateOrderStack}
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, size, focused }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}