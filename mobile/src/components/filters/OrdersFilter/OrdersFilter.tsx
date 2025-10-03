import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../../contexts/ThemeContext';
import { metrics, typography, lightColors } from '../../../styles';

interface FilterTabsProps {
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const OrdersFilter: React.FC<FilterTabsProps> = ({ data, selectedValue, onSelect }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      paddingHorizontal: metrics.spacing.md,
      paddingTop: metrics.spacing.md,
      paddingBottom: metrics.spacing.md,
    },
    content: {
      gap: metrics.spacing.sm,
    },
    button: {
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.pill,
    },
    buttonText: {
      ...typography.textStyles.caption,
      fontFamily: typography.fonts.inter.medium,
    },
  }), []);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {data.map((filter) => {
          const isSelected = selectedValue === filter;
          
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.button,
                { 
                  backgroundColor: isSelected ? colors.primary : `${colors.primary}1A` 
                },
              ]}
              onPress={() => onSelect(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { 
                  color: isSelected ? lightColors.background : colors.primary 
                },
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default OrdersFilter;