import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  if(!visible) return null;

  if (isChoice) {
    // Modal grande en el centro para elecciones
    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[StyleSheet.absoluteFill,
          { backgroundColor: `${colors.background}50`, zIndex: 1000, elevation: 1000, justifyContent: 'center', alignItems: 'center' }
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
          <View className="w-11/12 max-w-md rounded-2xl p-6"
            style={{ backgroundColor: colors.surfaceButton, zIndex: 1001}}
          >
            {/* Título */}
            <Text 
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: success ? colors.success : colors.error }}
            >
              {title}
            </Text>

            {/* Descripción */}
            <Text 
              className="text-base mb-6 text-center leading-6"
              style={{ color: colors.secondaryText }}
            >
              {description}
            </Text>

            {/* Botones */}
            <View className="flex-row gap-3">
              {/* Botón izquierdo */}
              {leftButtonText && (
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl"
                  style={{ 
                    backgroundColor: !highlightRight ? highlightColor : colors.background,
                  }}
                  onPress={onLeftPress}
                  activeOpacity={0.7}
                >
                  <Text 
                    className="text-center font-semibold text-base"
                    style={{ color: colors.primaryText }}
                  >
                    {leftButtonText}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Botón derecho */}
              {rightButtonText && (
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl"
                  style={{ 
                    backgroundColor: highlightRight ? highlightColor : colors.background,
                  }}
                  onPress={onRightPress}
                  activeOpacity={0.7}
                >
                  <Text 
                    className="text-center font-semibold text-base"
                    style={{ color: colors.primaryText }}
                  >
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
        style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 1000, justifyContent: 'flex-end' }]}
        pointerEvents='box-none'
      >
        <View 
          className="mx-4 rounded-2xl p-4 shadow-lg"
          style={{ backgroundColor: colors.surfaceButton, marginBottom: Math.max(insets.bottom + 16, 24) }}
          pointerEvents='auto'
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              {/* Título */}
              <Text 
                className="text-lg font-bold mb-2"
                style={{ color: success ? colors.success : colors.error }}
              >
                {title}
              </Text>

              {/* Descripción */}
              <Text 
                className="text-sm leading-5"
                style={{ color: colors.secondaryText }}
              >
                {description}
              </Text>
            

              {/* Botón de cerrar */}
              {(leftButtonText || rightButtonText) && (
                <View className="flex-row gap-2 mt-4">
                  {leftButtonText && (
                    <TouchableOpacity
                      className="flex-1 py-2 rounded-lg"
                      style={{ 
                        backgroundColor: !highlightRight ? highlightColor : 'transparent',
                        borderWidth: !highlightRight ? 0 : 1.5,
                        borderColor: !highlightRight ? 'transparent' : colors.borderButton,
                      }}
                      onPress={onLeftPress}
                      activeOpacity={0.7}
                    >
                      <Text 
                        className="text-center font-semibold text-sm"
                        style={{ color: !highlightRight ? colors.background : colors.primaryText }}
                      >
                        {leftButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {rightButtonText && (
                    <TouchableOpacity
                      className="flex-1 py-2 rounded-lg"
                      style={{ 
                        backgroundColor: highlightRight ? highlightColor : 'transparent',
                        borderWidth: highlightRight ? 0 : 1.5,
                        borderColor: highlightRight ? 'transparent' : colors.borderButton,
                      }}
                      onPress={onRightPress}
                      activeOpacity={0.7}
                    >
                      <Text 
                        className="text-center font-semibold text-sm"
                        style={{ color: highlightRight ? colors.background : colors.primaryText }}
                      >
                        {rightButtonText}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              className='p-1'
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={colors.secondaryText} 
                />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
};


