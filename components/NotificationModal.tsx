import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface NotificationModalProps {
  visible: boolean;
  title: string;
  description: string;
  leftButtonText?: string;
  rightButtonText?: string;
  highlightRight?: boolean;
  isChoice: boolean; // true = modal grande en medio, false = modal pequeño abajo
  delete?: boolean; // Si es una notificación de eliminación, el botón derecho se resalta en rojo
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

  if (isChoice) {
    // Modal grande en el centro para elecciones
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable 
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={onClose}
        >
          <Pressable 
            className="w-11/12 max-w-md rounded-2xl p-6"
            style={{ backgroundColor: colors.surfaceButton }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Título */}
            <Text 
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: colors.primaryText }}
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
          </Pressable>
        </Pressable>
      </Modal>
    );
  } else {
    // Modal pequeño abajo para notificaciones
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable 
          className="flex-1 justify-end"
          onPress={onClose}
        >
          <Pressable
            className="mx-4 rounded-2xl p-4 shadow-lg"
            style={{ backgroundColor: colors.surfaceButton, marginBottom: Math.max(insets.bottom + 16, 24) }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                {/* Título */}
                <Text 
                  className="text-lg font-bold mb-2"
                  style={{ color: colors.primaryText }}
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

                {/* Botones opcionales para notificación */}
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

              {/* Botón de cerrar */}
              <TouchableOpacity
                onPress={onClose}
                className="p-1"
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={colors.secondaryText} 
                />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
};


