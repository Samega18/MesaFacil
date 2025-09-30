/**
 * @file Ponto de entrada central para todos os estilos globais da aplicação.
 * Re-exporta tudo para facilitar a importação em outros arquivos.
 * Exemplo de uso: import { colors, metrics, typography } from '@/styles';
 */

import { colors, lightColors, darkColors } from './colors';
import * as metrics from './metrics';
import * as typography from './typography';

export { colors, lightColors, darkColors, metrics, typography };
