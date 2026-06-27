import { useTheme } from 'context/ThemeContext';
import { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
interface DateSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const DateSelector = ({ selectedYear, onYearChange }: DateSelectorProps) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [inputYear, setInputYear] = useState(selectedYear.toString());

  const { colors } = useTheme();
  const { t } = useTranslation();

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
      <TouchableOpacity
        activeOpacity={0.6}
        onPressOut={() => handleYearChange(selectedYear - 1)}
        disabled={selectedYear <= minYear}>
        <AppText className="px-2 font-bold" style={{ color: leftColor, fontSize: 18 }}>
          {'<'}
        </AppText>
      </TouchableOpacity>

      {/* Contenedor Relativo del Año - Ahora es clicable */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          setInputYear(selectedYear.toString());
          setShowYearPicker(true);
        }}
        className="relative">
        <AppText className="font-bold tracking-widest" style={{ color: colors.title, fontSize: 18 }}>
          {selectedYear}
        </AppText>

        {/* Línea Absoluta: se expande solo lo que mide el texto de arriba */}
        <View
          className="bg-secondaryText/50 absolute left-0 right-0"
          style={{
            height: 1, // Grosor de la línea
            bottom: 8, // Ajusta este número para acercar o alejar la línea del número
          }}
        />
      </TouchableOpacity>

      {/* Botón Derecho */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPressOut={() => handleYearChange(selectedYear + 1)}
        disabled={selectedYear >= maxYear}>
        <AppText className="px-2 font-bold" style={{ color: rightColor, fontSize: 18 }}>
          {'>'}
        </AppText>
      </TouchableOpacity>

      {/* Modal para seleccionar año manualmente */}
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setShowYearPicker(false)}>
          <Pressable
            className="w-64 rounded-lg p-6"
            style={{ backgroundColor: colors.background }}
            onPress={(e) => e.stopPropagation()}>
            <AppText className="mb-4 text-center font-bold" style={{ color: colors.title, fontSize: 18 }}>
              {t('profile.selectYear')}
            </AppText>

            <AppTextInput
              value={inputYear}
              onChangeText={setInputYear}
              keyboardType="numeric"
              maxLength={4}
              className="mb-4 rounded-lg border px-4 py-3 text-center"
              style={{
                backgroundColor: colors.surfaceButton,
                borderColor: colors.borderButton,
                color: colors.title,
                fontSize: 18,
              }}
              placeholderTextColor={colors.placeholderText}
              autoFocus
              onSubmitEditing={handleYearSubmit}
            />

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setShowYearPicker(false)}
                className="flex-1 items-center rounded-lg py-3">
                <AppText className="font-semibold" style={{ color: colors.secondaryText, fontSize: 14 }}>
                  {t('common.cancel')}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleYearSubmit}
                className="flex-1 items-center rounded-lg py-3"
                style={{ backgroundColor: colors.primary }}>
                <AppText className="font-semibold" style={{ color: colors.background, fontSize: 14 }}>
                  {t('common.accept')}
                </AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
