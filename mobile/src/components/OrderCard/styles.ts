import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../styles';

/**
 * Estilos para OrderCard.
 */
export const styles = StyleSheet.create({
  container: {
    borderRadius: metrics.radius.card,
    borderWidth: 0.5,
    padding: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
    ...metrics.shadows.card,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: metrics.spacing.sm,
  },

  orderInfo: {
    flex: 1,
  },

  orderNumber: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.semibold,
    marginBottom: metrics.spacing.xs,
  },

  orderDateTime: {
    ...typography.textStyles.caption,
    fontFamily: typography.fonts.inter.regular,
  },

  statusBadge: {
    paddingHorizontal: metrics.spacing.sm,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.pill,
  },

  statusText: {
    ...typography.textStyles.caption2,
    fontFamily: typography.fonts.inter.medium,
  },

  orderItems: {
    ...typography.textStyles.caption,
    fontFamily: typography.fonts.inter.semibold,
    marginTop: metrics.spacing.md,
    marginBottom: metrics.spacing.xs,
  },

  orderTotal: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.bold,
    marginTop: metrics.spacing.xs,
  },
});