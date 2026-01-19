import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';

interface DateSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const DateSelector = ({ selectedYear, onYearChange }: DateSelectorProps) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [inputYear, setInputYear] = useState(selectedYear.toString());

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

  const leftStyle = selectedYear <= 1900 ? 'inactive text-title/30' : 'active text-title';
  const rightStyle = selectedYear >= new Date().getFullYear() ? 'inactive text-title/30' : 'active text-title';

  return (
    <View className="flex-row space-x-8">
      {/* Botón Izquierdo */}
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => handleYearChange(selectedYear - 1)}>
        <Text className={`px-2 text-xl font-bold ${leftStyle}`}>{'<'}</Text>
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
        <Text className="text-xl font-bold tracking-widest text-title">{selectedYear}</Text>

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
      <TouchableOpacity activeOpacity={0.6} onPressOut={() => handleYearChange(selectedYear + 1)}>
        <Text className={`px-2 text-xl font-bold ${rightStyle}`}>{'>'}</Text>
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
            className="bg-background rounded-lg p-6 w-64"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-title text-lg font-bold mb-4 text-center">
              Seleccionar Año
            </Text>
            
            <TextInput
              value={inputYear}
              onChangeText={setInputYear}
              keyboardType="numeric"
              maxLength={4}
              className="bg-card border border-secondaryText/30 rounded-lg px-4 py-3 text-title text-center text-xl mb-4"
              placeholder="2024"
              placeholderTextColor="#666"
              autoFocus
              onSubmitEditing={handleYearSubmit}
            />

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowYearPicker(false)}
                className="flex-1 bg-card rounded-lg py-3 items-center"
              >
                <Text className="text-secondaryText font-semibold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleYearSubmit}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-background font-semibold">Aceptar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
