import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DateSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const DateSelector = ({ selectedYear, onYearChange }: DateSelectorProps) => {
  return (
    <View className="flex-row space-x-8">
      {/* Botón Izquierdo */}
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => onYearChange(selectedYear - 1)}>
        <Text className="px-2 text-xl font-bold text-title">{'<'}</Text>
      </TouchableOpacity>

      {/* Contenedor Relativo del Año */}
      <View className="relative">
        <Text className="text-xl font-bold tracking-widest text-title">{selectedYear}</Text>

        {/* Línea Absoluta: se expande solo lo que mide el texto de arriba */}
        <View
          className="absolute left-0 right-0 bg-secondaryText/50"
          style={{
            height: 1, // Grosor de la línea
            bottom: 8, // Ajusta este número para acercar o alejar la línea del número
          }}
        />
      </View>
      {/* Botón Derecho */}
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => onYearChange(selectedYear + 1)}>
        <Text className="px-2 text-xl font-bold text-title">{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};
