import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from 'lib/supabase';
import { useAuth } from 'context/AuthContext';
import { GameResource } from 'app/types/Resources';
import { useTheme } from 'context/ThemeContext';
import { useCollection } from 'context/CollectionContext';

export default function ListForm() {
  const {colors} = useTheme();
	const [lists, setLists] = useState([]);
	//Iconos que se pueden elegir para las listas
	const icons = [
  "cloud",
  "star",
  "heart",
	"all-inclusive",
  "bookmark",
  "music",
  "filmstrip",
	"book",
  "gamepad-square",
  "airplane-takeoff",
  "car",
  "camera",
  ];
	//Colores que se pueden elegir para las listas
	const iconoColors = [
  { name: "Verde", value: "#4ADE80" },
  { name: "Azul", value: "#60A5FA" },
  { name: "Rojo", value: "#F87171" },
  { name: "Amarillo", value: "#FACC15" },
  { name: "Morado", value: "#A78BFA" },
  { name: "Rosa", value: "#F472B6" },
  { name: "Naranja", value: "#FB923C" },
  { name: "Cian", value: "#22D3EE" },
	];

	//Inicializamos el estado del formulario
	const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "cloud",
    color: iconoColors.map(c => c.value)[1],
    category: "",
  });
  


  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 py-6">
          <View className="items-center justify-center mb-6">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center shadow-md"
              style={{ backgroundColor: formData.color }}
            >
              <MaterialCommunityIcons name={formData.icon as any} size={32} color={colors.primaryText} />
            </View>
          </View>

					<View className="mb-5">
            <Text className="text-sm font-semibold mb-2 ml-1" style={{ color: colors.primaryText }}>
              Nombre de la lista
            </Text>
            <TextInput
              placeholder="Ej: Películas favoritas"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              className="px-4 py-4 rounded-xl"
              style={{ color: colors.secondaryText, backgroundColor: colors.tabBarBackgroundColor }}

            />
          </View>

					<View className="mb-5">
            <Text className="text-sm font-semibold mb-2 ml-1" style={{ color: colors.primaryText }}>
              Descripción
            </Text>
            <TextInput
              placeholder="Describe el contenido de esta lista..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              className="px-4  rounded-xl text-mutedText"
              style={{ 
								color: colors.secondaryText, 
								backgroundColor: colors.tabBarBackgroundColor, 
								textAlignVertical: 'top', 
								paddingTop: 10
							}}
							multiline
							numberOfLines={6}
            />
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold mb-2 ml-1" style={{ color: colors.primaryText }}>Icono</Text>
            <View className="flex-row flex-wrap gap-2 justify-between">
              {icons.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  onPress={() => setFormData({ ...formData, icon: iconName })}
                  className={`w-[14%] aspect-square rounded-xl items-center justify-center ${
                    formData.icon === iconName
                  }`}
									style={{ backgroundColor: formData.icon === iconName ? colors.primary : colors.tabBarBackgroundColor }}
                >
                  <MaterialCommunityIcons name={iconName as any} size={20} color={formData.icon === iconName ? colors.primaryText : colors.secondaryText} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

					<View className="mb-6">
            <Text className="text-sm font-semibold mb-2 ml-1" style={{ color: colors.primaryText }}>Color</Text>
            <View className="flex-row flex-wrap gap-2 justify-between">
              {iconoColors.map(({ name, value }) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setFormData({ ...formData, color: value })}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    formData.color === value 
                  }`}
									// Si el color es el seleccionado, mostramos un borde, si no, solo el círculo de color
                  style={{ backgroundColor: value, borderWidth: formData.color === value ? 2 : 0, borderColor: colors.primaryText }}
                >
                  {formData.color === value }
                </TouchableOpacity>
              ))}
            </View>
          </View>
		  	<TouchableOpacity 
					onPress={() => {}} 
					className="flex-1 py-4 rounded-xl items-center flex-row justify-center"
					style={{backgroundColor: colors.primary}}
		  	>
					<FontAwesome5 name="cloud-upload-alt" size={16} color={colors.primaryText} style={{marginRight: 8}} />
					<Text className=" font-bold" style={{ color: colors.primaryText }}>Añadir lista</Text>
		  	</TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}