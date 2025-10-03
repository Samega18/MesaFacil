import { StyleSheet } from 'react-native';
import { metrics } from '../../../styles';

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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: metrics.spacing.xl * 2,
    paddingHorizontal: metrics.spacing.lg,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});