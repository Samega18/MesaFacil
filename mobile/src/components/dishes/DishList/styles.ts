import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export const styles = StyleSheet.create({
  // Container da lista
  listContent: {
    padding: scale(16),
    paddingBottom: verticalScale(100), // Espaço extra para tab bar
  },

  // Separador entre itens
  separator: {
    height: verticalScale(16),
  },
});