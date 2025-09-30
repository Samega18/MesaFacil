import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/SafeScreen';

function Menu() {
  return (
    <View style={styles.container}>
      <Text>Tela de Cardápio (Menu)</Text>
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

function MenuScreen() {
  return (
    <SafeScreen>
      <Menu />
    </SafeScreen>
  );
}

export default MenuScreen;