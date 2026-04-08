import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface NotificationModalProps {
  visible: boolean;
  title: string;
  description: string | React.ReactNode;
  leftButtonText?: string;
  rightButtonText?: string;
  highlightRight?: boolean;
  isChoice: boolean; // true = modal grande en medio, false = modal pequeño abajo
  delete?: boolean; // Si es una notificación de eliminación, el botón derecho se resalta en rojo
  success?: boolean;
  info?: boolean;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  onClose?: () => void;
}

export const NotificationModal = ({
  visible,
  title,
  description,
  leftButtonText,
  rightButtonText,
  highlightRight = true,
  isChoice,
  delete: isDelete = false,
  success = false,
  info = false,
  onLeftPress,
  onRightPress,
  onClose,
}: NotificationModalProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Determinar el color del botón resaltado basado en si es una eliminación
  const highlightColor = isDelete ? colors.error : colors.primary;

  // Auto-cerrar el modal pequeño después de 3 segundos
  useEffect(() => {
    if (visible && !isChoice) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, isChoice, onClose]);

  if (!visible) return null;

  if (isChoice) {
    // Modal grande en el centro para elecciones
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: `${colors.background}50`,
            zIndex: 1000,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View
          className="w-11/12 max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.surfaceButton, zIndex: 1001 }}>
          {/* Título */}
          <Text
            className="mb-4 text-center text-2xl font-bold"
            style={{ color: info ? colors.primaryText : success ? colors.success : colors.error }}>
            {title}
          </Text>

          {/* Descripción */}
          <Text
            className="mb-6 text-center text-base leading-6"
            style={{ color: colors.secondaryText }}>
            {description}
          </Text>

          {/* Botones */}
          <View className="flex-row gap-3">
            {/* Botón izquierdo */}
            {leftButtonText && (
              <TouchableOpacity
                className="flex-1 rounded-xl py-3"
                style={{
                  backgroundColor: !highlightRight ? highlightColor : colors.background,
                }}
                onPress={onLeftPress}
                activeOpacity={0.7}>
                <Text
                  className="text-center text-base font-semibold"
                  style={{ color: colors.primaryText }}>
                  {leftButtonText}
                </Text>
              </TouchableOpacity>
            )}

            {/* Botón derecho */}
            {rightButtonText && (
              <TouchableOpacity
                className="flex-1 rounded-xl py-3"
                style={{
                  backgroundColor: highlightRight ? highlightColor : colors.background,
                }}
                onPress={onRightPress}
                activeOpacity={0.7}>
                <Text
                  className="text-center text-base font-semibold"
                  style={{ color: colors.primaryText }}>
                  {rightButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  } else {
    // Modal pequeño abajo para notificaciones
    return (
      <Animated.View
        entering={SlideInDown.duration(300).springify()}
        exiting={SlideOutDown.duration(300)}
        style={[StyleSheet.absoluteFill, { zIndex: 1000, justifyContent: 'flex-end' }]}
        pointerEvents="box-none">
        <View
          className="mx-4 rounded-2xl p-4 shadow-lg"
          style={{
            backgroundColor: colors.surfaceButton,
            marginBottom: Math.max(insets.bottom + 16, 24),
            shadowColor: colors.backgroundColor,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            elevation: 10,
            borderTopWidth: Platform.OS === 'ios' ? 0 : 3.5,
            borderLeftWidth: Platform.OS === 'ios' ? 0 : 0.5,
            borderRightWidth: Platform.OS === 'ios' ? 0 : 0.5,
            borderColor: `${colors.secondaryText}1A`,
          }}
          pointerEvents="auto">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              {/* Título */}
              <Text
                className="mb-2 text-lg font-bold"
                style={{
                  color: info ? colors.primaryText : success ? colors.success : colors.error,
                }}>
                {title}
              </Text>

              {/* Descripción */}
              <Text className="text-sm leading-5" style={{ color: colors.secondaryText }}>
                {description}
              </Text>

              {/* Botón de cerrar */}
              {(leftButtonText || rightButtonText) && (
                <View className="mt-4 flex-row gap-2">
                  {leftButtonText && (
                    <TouchableOpacity
                      className="flex-1 rounded-lg py-2"
                      style={{
                        backgroundColor: !highlightRight ? highlightColor : 'transparent',
                        borderWidth: !highlightRight ? 0 : 1.5,
                        borderColor: !highlightRight ? 'transparent' : colors.borderButton,
                      }}
                      onPress={onLeftPress}
                      activeOpacity={0.7}>
                      <Text
                        className="text-center text-sm font-semibold"
                        style={{ color: !highlightRight ? colors.background : colors.primaryText }}>
                        {leftButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {rightButtonText && (
                    <TouchableOpacity
                      className="flex-1 rounded-lg py-2"
                      style={{
                        backgroundColor: highlightRight ? highlightColor : 'transparent',
                        borderWidth: highlightRight ? 0 : 1.5,
                        borderColor: highlightRight ? 'transparent' : colors.borderButton,
                      }}
                      onPress={onRightPress}
                      activeOpacity={0.7}>
                      <Text
                        className="text-center text-sm font-semibold"
                        style={{ color: highlightRight ? colors.background : colors.primaryText }}>
                        {rightButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <MaterialCommunityIcons name="close" size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
};
