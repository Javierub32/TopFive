import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { CategoryKey } from '@/Add/hooks/useSearchContent';


interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: CategoryKey) => void;
}

export function AddModal({ visible, onClose, onSelect }: AddModalProps) {
  const options: { type: CategoryKey; label: string; icon: string }[] = [
    { type: 'Libros', label: 'Libro', icon: '📚' },
    { type: 'Películas', label: 'Película', icon: '🎬' },
    { type: 'Series', label: 'Serie', icon: '📺' },
    { type: 'Canciones', label: 'Canción', icon: '🎵' },
    { type: 'Videojuegos', label: 'Juego', icon: '🎮' },
  ];

  const handleSelect = (type: CategoryKey) => {
    onSelect(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 items-center justify-center bg-black/70" onPress={onClose}>
        <Pressable 
          className="w-[85%] max-w-[400px] rounded-3xl bg-surfaceButton p-6 shadow-2xl" 
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="mb-2 text-center text-2xl font-bold text-primaryText">
            ¿Qué quieres agregar?
          </Text>
          <Text className="mb-6 text-center text-sm text-secondaryText">
            Selecciona el tipo de contenido
          </Text>

          <View className="gap-3">
            {options.map((option) => (
              <TouchableOpacity
                key={option.type}
                className="flex-row items-center rounded-xl border border-borderButton bg-background p-4"
                onPress={() => handleSelect(option.type)}
                activeOpacity={0.7}
              >
                <Text className="mr-4 text-[28px]">{option.icon}</Text>
                <Text className="text-lg font-semibold text-primaryText">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            className="mt-4 rounded-xl border border-borderButton bg-transparent p-3.5"
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text className="text-center text-base font-semibold text-secondaryText">
              Cancelar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
