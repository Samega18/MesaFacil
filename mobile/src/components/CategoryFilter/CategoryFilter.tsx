import React, { useMemo } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { metrics, typography, lightColors } from '../../styles';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    categoriesContent: {
      paddingHorizontal: metrics.spacing.md,
      gap: metrics.spacing.sm,
    },
    categoryButton: {
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.pill,
      backgroundColor: `${colors.primary}1A`,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      ...metrics.shadows.card,
    },
    categoryButtonText: {
      ...typography.textStyles.caption,
      color: colors.primary,
    },
    categoryButtonTextActive: {
      ...typography.textStyles.caption,
      color: lightColors.background,
    },
  }), [colors]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => onSelectCategory(category)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;