import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenuStack } from './MenuStack';
import { OrdersStack } from './OrdersStack';
import { metrics, typography } from '../styles';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const Value: string = insets.bottom.toString();

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
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 10 : 5),
          height: (Platform.OS === 'ios' ? 90 : 70) + insets.bottom,
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