import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { metrics, typography } from '../../../styles';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const containerStyle: StyleProp<ViewStyle> = [styles.baseContainer, style];
  const textStyle: TextStyle[] = [styles.baseText];

  if (variant === 'primary') {
    containerStyle.push({ backgroundColor: colors.primary });
    textStyle.push({ color: colors.background });
  }

  if (variant === 'secondary') {
    containerStyle.push({
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.primary,
    });
    textStyle.push({ color: colors.primary });
  }

  if (isDisabled) {
    containerStyle.push({
      backgroundColor: colors.divider,
      borderColor: colors.divider,
    });
    textStyle.push({ color: colors.textSecondary });
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.background : colors.primary} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.pill,
    paddingHorizontal: metrics.spacing.md,
  },
  baseText: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.bold,
  },
});

export default Button;