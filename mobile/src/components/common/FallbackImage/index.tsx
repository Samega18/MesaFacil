import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';

interface FallbackImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string };
  fallbackIcon?: keyof typeof Feather.glyphMap;
  fallbackSize?: number;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  source,
  style,
  fallbackIcon = 'image',
  fallbackSize = 24,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Se a URI estiver vazia ou inválida, mostra o fallback diretamente
  if (!source?.uri || source.uri.trim() === '' || hasError) {
    return (
      <View style={[styles.fallbackContainer, style, { backgroundColor: colors.divider }]}>
        <Feather 
          name={fallbackIcon} 
          size={fallbackSize} 
          color={colors.textSecondary} 
        />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FallbackImage;