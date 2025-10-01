import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../styles';

/**
 * Estilos otimizados para a tela de lista de pedidos.
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: metrics.spacing.md,
    paddingBottom: metrics.spacing.lg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.md,
    borderBottomWidth: 0.5,
    ...metrics.shadows.card,
  },

  headerPlaceholder: {
    width: 40,
  },

  headerTitle: {
    ...typography.textStyles.h3,
    fontFamily: typography.fonts.inter.bold,
    textAlign: 'center',
    flex: 1,
  },

  refreshButton: {
    padding: metrics.spacing.sm,
    borderRadius: metrics.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
});