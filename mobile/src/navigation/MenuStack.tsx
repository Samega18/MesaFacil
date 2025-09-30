import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MenuScreen from '../screens/Menu';
import CreateOrderScreen from '../screens/CreateOrder';

const Stack = createNativeStackNavigator();

export function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
    </Stack.Navigator>
  );
}