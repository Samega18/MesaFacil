/**
 * @file Define os estilos de tipografia, incluindo família, tamanhos e pesos da fonte.
 * Os tamanhos são escaláveis usando 'react-native-size-matters'.
 */
import { scale } from 'react-native-size-matters';
import { TextStyle } from 'react-native';

export const fonts = {
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
};

export const fontSizes = {
  h1: scale(24),
  h2: scale(20),
  h3: scale(18),
  body1: scale(16),
  body2: scale(14),
  caption: scale(12),
  caption2: scale(10),
};

// Estilos de texto pré-definidos para facilitar o uso
export const textStyles = {
  h1: {
    fontFamily: fonts.inter.bold,
    fontSize: fontSizes.h1,
  } as TextStyle,
  h2: {
    fontFamily: fonts.inter.semibold,
    fontSize: fontSizes.h2,
  } as TextStyle,
  h3: {
    fontFamily: fonts.inter.semibold,
    fontSize: fontSizes.h3,
  } as TextStyle,
  body1: {
    fontFamily: fonts.inter.regular,
    fontSize: fontSizes.body1,
  } as TextStyle,
  body2: {
    fontFamily: fonts.inter.regular,
    fontSize: fontSizes.body2,
  } as TextStyle,
  caption: {
    fontFamily: fonts.inter.medium,
    fontSize: fontSizes.caption,
  } as TextStyle,
  caption2: {
    fontFamily: fonts.inter.medium,
    fontSize: fontSizes.caption2,
  } as TextStyle,
};
