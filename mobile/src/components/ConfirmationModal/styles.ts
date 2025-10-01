import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../styles';

/**
 * Estilos para ConfirmationModal.
 */
export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.lg,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: metrics.radius.card,
    padding: metrics.spacing.lg,
    ...metrics.shadows.card,
  },

  title: {
    ...typography.textStyles.h3,
    textAlign: 'center',
    marginBottom: metrics.spacing.md,
  },

  message: {
    ...typography.textStyles.body2,
    textAlign: 'center',
    marginBottom: metrics.spacing.xl,
    lineHeight: 20,
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: metrics.radius.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    ...typography.textStyles.body2,
    fontFamily: typography.fonts.inter.semibold,
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: metrics.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    ...metrics.shadows.card,
  },

  confirmButtonText: {
    ...typography.textStyles.body2,
    fontFamily: typography.fonts.inter.semibold,
  },
});