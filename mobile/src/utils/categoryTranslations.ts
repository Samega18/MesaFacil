import { DishCategory } from '../types/models';

/**
 * Mapeamento das categorias de pratos do inglês para português
 */
export const categoryTranslations: Record<DishCategory, string> = {
  APPETIZER: 'Entrada',
  MAIN_COURSE: 'Prato Principal',
  DESSERT: 'Sobremesa',
  DRINK: 'Bebida',
};

/**
 * Traduz uma categoria de prato do inglês para português
 * @param category - Categoria em inglês
 * @returns Categoria traduzida para português
 */
export const translateCategory = (category: DishCategory): string => {
  return categoryTranslations[category] || category;
};