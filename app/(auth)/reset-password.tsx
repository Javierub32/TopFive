import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';

// Frases aleatorias con iconos - fuera del componente para mejor rendimiento
const frasesConIconos = [
  { texto: '  Tu butaca reservada te espera.', icono: 'movie-open' },
  { texto: '  Tu inventario de entretenimiento, en un solo lugar.', icono: 'archive-star' },
  { texto: '  Marca tu página. Guarda tu mundo.', icono: 'bookmark-check' },
  { texto: '  Tu vida, tu ranking, tu TopFive.', icono: 'podium-gold' },
  { texto: '  Tu mixtape definitiva está aquí.', icono: 'music-box-multiple' }
];

export default function ResetPasswordScreen() {
  const { changePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { colors } = useTheme();

  // Seleccionar una frase aleatoria - se ejecuta cada vez que se renderiza el componente
  const fraseAleatoria = useState(() => 
	frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];

  const handleChangePassword = async () => {
	setLoading(true);
	try {
	  if (password !== confirmPassword) {
		Alert.alert('Error', 'Las contraseñas no coinciden. \n Por favor, inténtalo de nuevo.');
		setLoading(false);
		return;
	  }
	  await changePassword(password);
	  router.replace('/(auth)/login');
	} catch (error) {
	  Alert.alert('Error', 'Error al cambiar la contraseña. \n Por favor, inténtalo de nuevo.');
	} finally {
	  setLoading(false);
	}
  };


  return (
	<View className='flex-1'>
	  <LinearGradient
		colors={[colors.background, colors.secondary, colors.secondary]}
		style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
	  >
		<View style={{ width: '100%', maxWidth: 550 }}>
		  {/* Título con icono */}
		  <View className="flex-row items-center justify-center mb-4">
			<View className="rounded-full p-3 mr-3" style= {{backgroundColor: `${colors.primaryText}20`}}>
			  <MaterialCommunityIcons name={fraseAleatoria.icono as any} size={40} color={colors.primaryText} />
			</View>
			<Text style={{fontSize: 24, fontWeight: 'bold', color: colors.primaryText}}>
			  TopFive
			</Text>
		  </View>
		  
		  {/* Frase aleatoria */}
		  <Text style={{fontSize: 14, marginBottom: 20, textAlign: 'center', color: colors.primaryText, opacity: 0.9, fontStyle: 'italic'}}>
			{" " +fraseAleatoria.texto}
		  </Text>
		  
		  <View className="rounded-3xl p-6 shadow-2xl" style={{backgroundColor: colors.background}}>
			  {/* Email Input */}
			  <View className="mb-4">
				<Text className="font-semibold my-3 ml-1 " style= {{color: colors.primaryText}}>Nueva contraseña</Text>
				<View className="flex-row items-center rounded-xl px-4 py-3" style= {{backgroundColor: colors.surfaceButton}}>
				  <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
				  <TextInput 
					placeholder="••••••••" 
					value={password} 
					onChangeText={setPassword} 
					className="flex-1 ml-3 text-base"
					placeholderTextColor={colors.placeholderText}
					secureTextEntry={!showPassword}
					style={{color: colors.primaryText}}
				  />
				  <TouchableOpacity 
					onPress={() => setShowPassword(!showPassword)}
					className="ml-2"
				  >
					<MaterialCommunityIcons 
					  name={showPassword ? "eye-off" : "eye"} 
					  size={24} 
					  color={colors.secondaryText}
					/>
				  </TouchableOpacity>
				</View>

				<Text className="font-semibold my-3 ml-1 " style= {{color: colors.primaryText}}>Confirmar contraseña</Text>
				<View className="flex-row items-center rounded-xl px-4 py-3" style= {{backgroundColor: colors.surfaceButton}}>
				  <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
				  <TextInput 
					placeholder="••••••••" 
					value={confirmPassword} 
					onChangeText={setConfirmPassword} 
					className="flex-1 ml-3 text-base"
					placeholderTextColor={colors.placeholderText}
					secureTextEntry={!showPassword}
					style={{color: colors.primaryText}}
				  />
				  <TouchableOpacity 
					onPress={() => setShowPassword(!showPassword)}
					className="ml-2"
				  >
					<MaterialCommunityIcons 
					  name={showPassword ? "eye-off" : "eye"} 
					  size={24} 
					  color={colors.secondaryText}
					/>
				  </TouchableOpacity>
				</View>

				<View className="mt-4" style={{}}>
				  <TouchableOpacity
					onPress={handleChangePassword}
					disabled={loading}
					className="overflow-hidden rounded-xl shadow-lg py-4 items-center"
					style={{backgroundColor: colors.accent}}
				  >
					<Text className="font-bold text-lg" style={{color: colors.primaryText}}>
					  {loading ? 'Cargando...' : 'Cambiar contraseña'}
					</Text>
				  </TouchableOpacity>
				</View>
				

			  </View>
		  </View>

		  
		</View>
	  </LinearGradient>
	</View>
  );
}