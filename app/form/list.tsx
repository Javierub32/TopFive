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


  return (
    <Screen>
      <StatusBar style="light" />
      <ScrollView className="flex-1 px-4 py-6">
          {/* 
		  Aquí haces el formulario, 
		  no hace falta que hagas un archivo hook porque la lógica de guardar solo se va a usar aquí,
		  haz igual que en los otros archivos form/, pon logica para poder crear una lista nueva y para poder editar una existente 
		  */}







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