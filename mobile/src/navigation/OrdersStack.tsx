import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrdersListScreen from '../screens/OrdersList';

const Stack = createNativeStackNavigator();

export function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={OrdersListScreen} />
    </Stack.Navigator>
  );
}