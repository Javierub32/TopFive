import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from 'lib/supabase';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import * as Linking from 'expo-linking';
import * as AppleAuthentication from 'expo-apple-authentication';

// Frases aleatorias con iconos - fuera del componente para mejor rendimiento
const frasesConIconos = [
  { texto: '  Tu butaca reservada te espera.', icono: 'movie-open' },
  { texto: '  Tu inventario de entretenimiento, en un solo lugar.', icono: 'archive-star' },
  { texto: '  Marca tu página. Guarda tu mundo.', icono: 'bookmark-check' },
  { texto: '  Tu vida, tu ranking, tu TopFive.', icono: 'podium-gold' },
  { texto: '  Tu mixtape definitiva está aquí.', icono: 'music-box-multiple' }
];

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {showNotification} = useNotification();
  
  const { colors } = useTheme();

  // Seleccionar una frase aleatoria - se ejecuta cada vez que se renderiza el componente
  const fraseAleatoria = useState(() => 
    frasesConIconos[Math.floor(Math.random() * frasesConIconos.length)]
  )[0];

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      // No necesitamos navegar manualmente, el _layout.js lo hará al detectar la sesión
    } catch (error) {
      //Alert.alert('Error', 'Credenciales inválidas. \n Por favor, inténtalo de nuevo.');
      showNotification({
        title: 'Error',
        description: 'Credenciales inválidas. Por favor, inténtalo de nuevo.',
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleNativeGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Asegúrate de que esta URL está en tu panel de Supabase
          redirectTo: Linking.createURL('/Home'), 
        },
      });

      if (error) console.error('Error en Web:', error);
      return; // Terminamos aquí, no ejecutamos lo de abajo
    }
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const token = response.data.idToken;

        if (token) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: token,
          });

          if (error) {
            showNotification({
              title: 'Error de Supabase',
              description: error.message,
              isChoice: false,
              delete: false,
              success: false,
            });
          } else {
            showNotification({
              title: '¡Éxito!',
              description: 'Sesión iniciada correctamente',
              isChoice: false,
              delete: false,
              success: true,
            });          
          }
        }
      } else {
        console.log('El usuario canceló el inicio de sesión');
      }
    } catch (error: any) {
      // Si algo explota a nivel de sistema, el móvil te avisará con una alerta
      Alert.alert('Error de Google', error.message || 'Error desconocido');
      console.error(error);
    }
  };
  const handleAppleLogin = async () =>{
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken){
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if(error) throw error;
        showNotification({
          title: '¡Éxito!',
          description: 'Sesión iniciada correctamente',
          isChoice: false,
          delete: false,
          success: true,
        })
      }
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED'){
        console.log('El usuario canceló el inicio de sesión con Apple');
      }else{
        Alert.alert('Error de Apple', e.message || 'Error desconocido');
      }
  }
}

  return (
    <ScrollView 
      className='flex-1' 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
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
                <Text className="font-semibold mb-1 ml-1" style= {{color: colors.primaryText}}>Email</Text>
                <View className="flex-row items-center rounded-xl px-4 py-3 mb-3" style= {{backgroundColor: colors.surfaceButton}}>
                  <MaterialCommunityIcons name="email-outline" size={24} color={colors.secondaryText}/>
                  <TextInput 
                    placeholder="tu@email.com" 
                    placeholderTextColor={colors.placeholderText}
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-3 text-base" 
                    style={{color: colors.primaryText}}
                  />
                </View>
                <Text className="font-semibold mb-1 ml-1" style= {{color: colors.primaryText}}>Contraseña</Text>
                <View className="flex-row items-center rounded-xl px-4 py-3" style= {{backgroundColor: colors.surfaceButton}}>
                  <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
                  <TextInput 
                    placeholder="••••••••" 
                    value={password} 
                    onChangeText={setPassword} 
                    className="text-base"
                    placeholderTextColor={colors.placeholderText}
                    secureTextEntry={!showPassword}
                    style={{flex: 1, marginLeft: 12, marginRight: 8, color: colors.primaryText, minWidth: 0}}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color={colors.secondaryText}
                    />
                  </TouchableOpacity>
                </View>
				
				<View className="my-4 pr-1" style={{}}>
                  <TouchableOpacity
                    onPress={() => router.push('/(auth)/forgot-password')}
                    disabled={loading}
                    className="items-end"
                  >
                    <Text className="" style={{color: colors.secondaryText}}>
                      ¿Has olvidado tu contraseña?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="py-2" style={{}}>
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className="overflow-hidden rounded-xl shadow-lg py-4 items-center"
                    style={{backgroundColor: colors.accent}}
                  >
                    <Text className="font-bold text-lg" style={{color: colors.primaryText}}>
                      {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Text>
                  </TouchableOpacity>
                </View>
				        <View className="" style={{}}>
                  <TouchableOpacity
                    onPress={handleNativeGoogleLogin}
                    disabled={loading}
                    className="overflow-hidden rounded-xl shadow-lg py-4 items-center"
                    style={{backgroundColor: colors.accent}}
                  >
                    <View className="flex-row items-center justify-center">
                      <AntDesign name="google" size={24} color={colors.primaryText} className="mr-2" />
                      <Text className="font-bold text-lg" style={{color: colors.primaryText}}>
                        {'Continuar con Google'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {Platform.OS === 'ios' && (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={5}
                    style={{ width: '100%', height: 44, marginTop: 10 }}
                    onPress={handleAppleLogin}
                  />
                )}

              </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center'}}>
            <Text className="text-base mb-2" style={{color: colors.primaryText}}>¿No tienes cuenta?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              className="px-6 py-3 rounded-full"
                style={{backgroundColor: `${colors.surfaceButton}80`}}
            >
              <Text className="font-semibold text-base" style={{color: colors.primaryText}}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 }
});