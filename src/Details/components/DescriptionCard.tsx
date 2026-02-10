import { useTheme } from 'context/ThemeContext';
import { View, Text } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";


interface Props {
  description: string | null;
}

export const DescriptionCard = ({ description }: Props) => {
  const { colors } = useTheme();

  const cleanHtmlDescription = (html: string | null | undefined): string => {
    if (!html) return '';
    
    return html
      // 1. Reemplazar tags <br> y <p> por saltos de línea reales
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      
      // 2. Eliminar cualquier otro tag HTML (<b>, <i>, etc.)
      .replace(/<[^>]+>/g, '')
      
      // 3. Decodificar entidades comunes
      .replace(/&nbsp;|&#xa0;/g, ' ')  // Espacios de no separación
      .replace(/&amp;/g, '&')          // Ampersand
      .replace(/&quot;/g, '"')         // Comillas dobles
      .replace(/&lt;/g, '<')           // Menor que
      .replace(/&gt;/g, '>')           // Mayor que
      
      // 4. Limpiar espacios extra resultantes
      .trim();
  };

  const [ isExpanded, setIsExpanded ] = useState(false);
  const MAX_LENGTH = 200;
  const shouldTruncate = description && description.length > MAX_LENGTH;
  const rawDescription = description || 'Sin descripción disponible.'
  const descriptionText = rawDescription.includes('<') ? cleanHtmlDescription(rawDescription) : rawDescription;

  const displayedDescription = shouldTruncate && !isExpanded
    ? descriptionText.slice(0, MAX_LENGTH) + '...'
    : descriptionText;

  return (
    <View
      className="space-y-3 rounded-2xl border-l-4 p-5"
      style={{ backgroundColor: colors.surfaceButton, borderColor: colors.borderButton }}>
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary} />
        <Text
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          Sinopsis
        </Text>
      </View>
      <Text style={{ color: colors.secondaryText }}>
        <Text className="italic leading-relaxed">{displayedDescription}</Text>
        {shouldTruncate && (
          <Text
            className="font-bold"
            style={{ color: colors.primary }}
            onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? ' Leer menos' : 'Leer más'}
          </Text>
        )}
      </Text>
    </View>
  );
};
