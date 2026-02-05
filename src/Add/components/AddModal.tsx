import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable, StatusBar } from 'react-native';
import { CategoryKey } from '@/Add/hooks/useSearchContent';
import { BookIcon, FilmIcon, ShowIcon, MusicIcon, GameIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { transparent } from 'tailwindcss/colors';


interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: CategoryKey) => void;
}

export function AddModal({ visible, onClose, onSelect }: AddModalProps) {
  const options: { type: CategoryKey; label: string; icon: any }[] = [
    { type: 'Libros', label: 'Libro', icon: BookIcon },
    { type: 'Películas', label: 'Película', icon: FilmIcon },
    { type: 'Series', label: 'Serie', icon: ShowIcon },
    { type: 'Videojuegos', label: 'Juego', icon: GameIcon },
    { type: 'Canciones', label: 'Canción', icon: MusicIcon },
  ];

  const handleSelect = (type: CategoryKey) => {
    onSelect(type);
    onClose();
  };
  
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <Pressable className="flex-1 items-center justify-center" style={{backgroundColor: `${colors.background}B3`}} onPress={onClose}>
        <Pressable 
          className="w-[85%] max-w-[400px] rounded-3xl p-6 shadow-2xl" 
          style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton, borderWidth: 1}}
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="mb-2 text-center text-2xl font-bold" style={{color: colors.primaryText}}>
            ¿Qué quieres agregar?
          </Text>
          <Text className="mb-6 text-center text-sm" style={{color: colors.secondaryText}}>
            Selecciona el tipo de contenido
          </Text>

          <View className="gap-3">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                key={option.type}
                className="flex-row items-center rounded-xl border p-4"
                style={{backgroundColor: colors.background, borderColor: colors.borderButton}}
                onPress={() => handleSelect(option.type)}
                activeOpacity={0.5}
              >
                <IconComponent color={colors.secondaryText} className="mr-4 text-[28px]"/>
                <Text className="text-lg font-semibold" style={{color: colors.primaryText}}>{option.label}</Text>
              </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className="mt-4 rounded-xl border p-3.5"
            style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton}}
            onPress={onClose}
            activeOpacity={0.5}
          >
            <Text className="text-center text-base font-semibold" style={{color: colors.secondaryText}}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
