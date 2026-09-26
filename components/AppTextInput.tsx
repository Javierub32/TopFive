import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useFontSize } from 'context/FontSizeContext';

export const AppTextInput = React.forwardRef<RNTextInput, TextInputProps>(
  ({ style, ...rest }, ref) => {
    const { fontSizeMultiplier } = useFontSize();

    const flattenedStyle = StyleSheet.flatten(style) || {};

    const baseFontSize = flattenedStyle.fontSize || 16;

    return (
      <RNTextInput
        ref={ref}
        style={[
          style,
          { fontSize: baseFontSize * fontSizeMultiplier }
        ]}
        {...rest}
      />
    );
  }
);
