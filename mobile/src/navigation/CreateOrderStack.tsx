import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateOrderScreen from '../screens/CreateOrder';

const Stack = createNativeStackNavigator();

export function CreateOrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateOrder" component={CreateOrderScreen} />
    </Stack.Navigator>
  );
}