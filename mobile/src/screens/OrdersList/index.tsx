import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/SafeScreen';

function OrdersList() {
  return (
    <View style={styles.container}>
      <Text>Tela de Pedidos (OrdersList)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

function OrdersListScreen() {
  return (
    <SafeScreen>
      <OrdersList />
    </SafeScreen>
  );
}

export default OrdersList;
