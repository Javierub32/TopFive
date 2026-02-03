import { useTheme } from 'context/ThemeContext';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';

interface DateSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const DateSelector = ({ selectedYear, onYearChange }: DateSelectorProps) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [inputYear, setInputYear] = useState(selectedYear.toString());

  const { colors } = useTheme();

  const handleYearSubmit = () => {
    const year = parseInt(inputYear, 10);
    if (!isNaN(year) && year >= 1900 && year <= new Date().getFullYear()) {
      onYearChange(year);
      setShowYearPicker(false);
    }
  };

  const handleYearChange = (year: number) => {
	if (year <= new Date().getFullYear() && year >= 1900) {
      onYearChange(year);
    }
  };

  const minYear = 1800;
  const maxYear = new Date().getFullYear();

  const leftColor = selectedYear <= minYear ? `${colors.title}4D` : colors.title;
  const rightColor = selectedYear >= maxYear ? `${colors.title}4D` : colors.title;

  return (
    <View className="flex-row space-x-8">
      {/* Botón Izquierdo */}
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => handleYearChange(selectedYear - 1)} disabled={selectedYear <= minYear}>
        <Text className="px-2 text-xl font-bold" style={{color: leftColor}}>{'<'}</Text>
      </TouchableOpacity>

      {/* Contenedor Relativo del Año - Ahora es clicable */}
      <TouchableOpacity 
        activeOpacity={0.6}
        onPress={() => {
          setInputYear(selectedYear.toString());
          setShowYearPicker(true);
        }}
        className="relative"
      >
        <Text className="text-xl font-bold tracking-widest" style={{color: colors.title}}>{selectedYear}</Text>

        {/* Línea Absoluta: se expande solo lo que mide el texto de arriba */}
        <View
          className="absolute left-0 right-0 bg-secondaryText/50"
          style={{
            height: 1, // Grosor de la línea
            bottom: 8, // Ajusta este número para acercar o alejar la línea del número
          }}
        />
      </TouchableOpacity>

      {/* Botón Derecho */}
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => handleYearChange(selectedYear + 1)} disabled={selectedYear >= maxYear}>
        <Text className="px-2 text-xl font-bold" style={{color: rightColor}}>{'>'}</Text>
      </TouchableOpacity>

      {/* Modal para seleccionar año manualmente */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 items-center justify-center"
          onPress={() => setShowYearPicker(false)}
        >
          <Pressable 
            className="rounded-lg p-6 w-64"
            style={{backgroundColor: colors.background}}
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold mb-4 text-center" style={{color: colors.title}}>
              Seleccionar Año
            </Text>
            
            <TextInput
              value={inputYear}
              onChangeText={setInputYear}
              keyboardType="numeric"
              maxLength={4}
              className="border rounded-lg px-4 py-3 text-center text-xl mb-4"
              style={{backgroundColor: colors.surfaceButton, borderColor: colors.borderButton, color: colors.title}}
              placeholderTextColor={colors.placeholderText}
              autoFocus
              onSubmitEditing={handleYearSubmit}
            />

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowYearPicker(false)}
                className="flex-1 rounded-lg py-3 items-center"
              >
                <Text className="font-semibold" style={{color: colors.secondaryText}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleYearSubmit}
                className="flex-1 rounded-lg py-3 items-center"
                style={{backgroundColor: colors.primary}}
              >
                <Text className="font-semibold" style={{color: colors.background}}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
