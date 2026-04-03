import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { supabase } from 'lib/supabase'; // Añadido Supabase
import * as Linking from 'expo-linking'; 

// Frases aleatorias con iconos - fuera del componente para mejor rendimiento
const frasesConIconos = [
  { texto: '  Tu butaca reservada te espera.', icono: 'movie-open' },
  { texto: '  Tu inventario de entretenimiento, en un solo lugar.', icono: 'archive-star' },
  { texto: '  Marca tu página. Guarda tu mundo.', icono: 'bookmark-check' },
  { texto: '  Tu vida, tu ranking, tu TopFive.', icono: 'podium-gold' },
  { texto: '  Tu mixtape definitiva está aquí.', icono: 'music-box-multiple' }
];

export default function ResetPasswordScreen() {
  const { changePassword, session } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { colors } = useTheme();
  const { showNotification } = useNotification();

  const fraseAleatoria = useState(() => 
    frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];

  const handleChangePassword = async () => {
    let activeSession = session;

    if (!activeSession) {
      try {
        setLoading(true);
        if (params.code) {
          const { data } = await supabase.auth.exchangeCodeForSession(params.code as string);
          activeSession = data?.session;
        } else if (params.access_token && params.refresh_token) {
          const { data } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string
          });
          activeSession = data?.session;
        }
        
        // 2. Si sigue sin encontrarlo, analizamos la URL pura
        if (!activeSession) {
          const url = await Linking.getInitialURL();
          if (url) {
            const codeMatch = url.match(/code=([^&]+)/);
            if (codeMatch) {
              const { data } = await supabase.auth.exchangeCodeForSession(codeMatch[1]);
              activeSession = data?.session;
            } else {
              const accessMatch = url.match(/access_token=([^&]+)/);
              const refreshMatch = url.match(/refresh_token=([^&]+)/);
              if (accessMatch && refreshMatch) {
                const { data } = await supabase.auth.setSession({ 
                  access_token: accessMatch[1], 
                  refresh_token: refreshMatch[1] 
                });
                activeSession = data?.session;
              }
            }
          }
        }
      } catch (e) {
        console.error("Error intentando rescatar la sesión desde la URL:", e);
      }
    }

    // Si después de todo esto sigue sin haber sesión, mostramos el error
    if (!activeSession) {
      setLoading(false);
      showNotification({
        title: 'Permiso denegado',
        description: 'El enlace ha caducado o está incompleto. Por favor, solicita un nuevo correo.',
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      showNotification({
        title: 'Error',
        description: 'Las contraseñas no coinciden. Por favor, revísalas.',
        isChoice: false,
        delete: false,
        success: false,
      });
      return;
    }

    setLoading(true);
    try {
      await changePassword(password);
      
      if (Platform.OS === 'web') {
        window.location.href = '/password-changed.html';
      } else {
        router.replace('/(auth)/login');
        
        setTimeout(() => {
          showNotification({
            title: '¡Éxito!',
            description: 'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.',
            isChoice: false,
            delete: false,
            success: true,
          });
        }, 200);
      }
    } catch (error: any) {
      let errorMessage = 'No se pudo actualizar la contraseña. El enlace podría haber caducado.';
      
      if (error && error.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('different from the old password') || msg.includes('same password')) {
          errorMessage = 'La nueva contraseña debe ser diferente a la que ya estabas usando.';
        } else if (msg.includes('security purposes') || msg.includes('rate limit')) {
          errorMessage = 'Has intentado cambiar la contraseña demasiadas veces. Por favor, espera unos minutos.';
        } else if (msg.includes('missing') || msg.includes('expired') || msg.includes('session')) {
          errorMessage = 'El enlace ha caducado o es inválido. Por favor, solicita uno nuevo.';
        } else {
          errorMessage = error.message; 
        }
      }

      showNotification({
        title: 'Error al cambiar contraseña',
        description: errorMessage,
        isChoice: false,
        delete: false,
        success: false,
      });
      
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