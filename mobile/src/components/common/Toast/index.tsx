import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { metrics, typography } from '../../../styles';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}) => {
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide após duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'info':
        return 'info';
      default:
        return 'check-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.feedback.success;
      case 'error':
        return colors.feedback.error;
      case 'info':
        return colors.feedback.info;
      default:
        return colors.feedback.success;
    }
  };

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 60,
      left: metrics.spacing.md,
      right: metrics.spacing.md,
      zIndex: 9999,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: getBackgroundColor(),
      paddingHorizontal: metrics.spacing.md,
      paddingVertical: metrics.spacing.sm,
      borderRadius: metrics.radius.input,
      ...metrics.shadows.card,
      minHeight: 56,
    },
    icon: {
      marginRight: metrics.spacing.sm,
    },
    message: {
      ...typography.textStyles.body2,
      color: '#FFFFFF',
      flex: 1,
      fontFamily: typography.fonts.inter.medium,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toast}>
        <Feather
          name={getIconName()}
          size={20}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;