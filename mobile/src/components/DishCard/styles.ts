import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { metrics, typography } from '../../styles';

export const styles = StyleSheet.create({
  // Container principal do card
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    padding: scale(12),
    borderRadius: metrics.radius.card,
    borderWidth: 1,
    ...metrics.shadows.card,
  },

  // Imagem do prato
  dishImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: metrics.radius.input,
    flexShrink: 0,
  },

  // Container das informações do prato
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: verticalScale(4),
  },

  // Nome do prato
  dishName: {
    ...typography.textStyles.body2,
    fontFamily: typography.fonts.inter.bold,
  },

  // Categoria do prato
  dishCategory: {
    ...typography.textStyles.caption,
    fontFamily: typography.fonts.inter.regular,
  },

  // Preço do prato
  dishPrice: {
    ...typography.textStyles.body2,
    fontFamily: typography.fonts.inter.bold,
  },

  // Container das ações (editar/excluir)
  actionsContainer: {
    flexDirection: 'column',
    gap: verticalScale(8),
    alignItems: 'center',
  },

  // Botões de ação
  actionButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
});