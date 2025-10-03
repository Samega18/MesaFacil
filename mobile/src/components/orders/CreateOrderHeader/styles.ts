import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../../styles';

/**
 * Estilos específicos para CreateOrderHeader.
 */
export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.md,
    borderBottomWidth: 0.5,
    ...metrics.shadows.card,
  },
  
  headerTitle: {
    ...typography.textStyles.h3,
    flex: 1,
    textAlign: 'center',
  },
});