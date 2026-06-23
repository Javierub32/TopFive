import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useFontSize } from 'context/FontSizeContext';

export const AppTextInput: React.FC<TextInputProps> = ({ style, ...rest }) => {
  const { fontSizeMultiplier } = useFontSize();

  const flattenedStyle = StyleSheet.flatten(style) || {};

  const baseFontSize = flattenedStyle.fontSize || 16; 

  return (
    <RNTextInput
      style={[
        style, 
        { fontSize: baseFontSize * fontSizeMultiplier }
      ]}
      {...rest}
    />
  );
};