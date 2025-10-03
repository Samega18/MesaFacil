import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { metrics, typography } from '../../../styles';

export const styles = StyleSheet.create({
  // Container principal do header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    
    // Efeito de backdrop blur simulado
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Botão de voltar
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Título do header
  headerTitle: {
    ...typography.textStyles.h2,
    fontFamily: typography.fonts.inter.bold,
    flex: 1,
    textAlign: 'center',
  },

  // Botão de adicionar
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: metrics.radius.input,
    ...metrics.shadows.card,
  },

  // Texto do botão adicionar
  addButtonText: {
    ...typography.textStyles.caption,
    fontFamily: typography.fonts.inter.bold,
  },
});