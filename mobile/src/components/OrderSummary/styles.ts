import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../styles';

export const styles = StyleSheet.create({
  footerContent: {
    padding: metrics.spacing.lg,
    borderTopWidth: 1,
    gap: metrics.spacing.md,
  },
  
  statusContainer: {
    borderWidth: 1,
    borderRadius: metrics.radius.card,
    padding: metrics.spacing.md,
  },
  
  statusLabel: {
    fontSize: typography.fontSizes.body2,
    fontFamily: typography.fonts.inter.medium,
    marginBottom: metrics.spacing.xs,
  },
  
  statusPicker: {
    height: 50,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  totalRow: {
    paddingTop: metrics.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  
  summaryLabel: {
    fontSize: typography.fontSizes.body1,
    fontFamily: typography.fonts.inter.medium,
  },
  
  summaryValue: {
    fontSize: typography.fontSizes.h3,
    fontFamily: typography.fonts.inter.bold,
  },
  
  confirmButton: {
    paddingVertical: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.lg,
    borderRadius: metrics.radius.card,
    alignItems: 'center',
    marginTop: metrics.spacing.sm,
  },
  
  confirmButtonText: {
    fontSize: typography.fontSizes.body1,
    fontFamily: typography.fonts.inter.bold,
  },
});