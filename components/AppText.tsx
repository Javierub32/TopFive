import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useFontSize } from 'context/FontSizeContext';

export const AppText: React.FC<TextProps> = ({ style, ...rest }) => {
  const { fontSizeMultiplier } = useFontSize();

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const baseFontSize = flattenedStyle.fontSize || 14;

  return (
    <RNText
      style={[
        style, 
        // Solo se cambia el tamaño de la fuente.
        // A posteriori, se pueden añadir cambios de estilos adicionales
        { fontSize: baseFontSize * fontSizeMultiplier }, 
      ]}
      {...rest} // Pasamos el resto de propiedades (numberOfLines, onPress, etc.)
    />
  );
};