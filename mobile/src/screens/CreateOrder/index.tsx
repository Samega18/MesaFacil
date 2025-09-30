import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/SafeScreen';

function CreateOrder() {
  return (
    <View style={styles.container}>
      <Text>Tela de Criação de Pedido (CreateOrder)</Text>
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

function CreateOrderScreen() {
  return (
    <SafeScreen>
      <CreateOrder />
    </SafeScreen>
  );
}

export default CreateOrderScreen;