import { StyleSheet } from 'react-native';
import { metrics } from '../../styles';

/**
 * Estilos específicos para OrderItemsList.
 */
export const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 120, // espaço para footer
  },
  
  separator: {
    height: 1,
    marginHorizontal: metrics.spacing.md,
  },
});