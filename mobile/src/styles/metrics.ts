/**
 * @file Define métricas responsivas para espaçamentos, bordas e sombras.
 * Utiliza 'react-native-size-matters' para garantir a adaptação a diferentes tamanhos de tela.
 */
import { moderateScale } from 'react-native-size-matters';

export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
};

export const radius = {
  card: moderateScale(12),
  input: moderateScale(8),
  pill: moderateScale(100), // Para botões com borda 100% arredondada
};

// As sombras em React Native são definidas com propriedades individuais.
// Este objeto serve como um "helper" para aplicar sombras consistentes.
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3, // Elevação para Android
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(16),
    elevation: 10, // Elevação para Android
  },
};
