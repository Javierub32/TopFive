import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
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

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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
      Alert.alert('Error Login', 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View className='flex-1'>
      <LinearGradient
        colors={[colors.background, colors.secondary, colors.primaryVariant]}
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
                  />
                </View>
                <Text className="font-semibold mb-1 ml-1" style= {{color: colors.primaryText}}>Contraseña</Text>
                <View className="flex-row items-center rounded-xl px-4 py-3" style= {{backgroundColor: colors.surfaceButton}}>
                  <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
                  <TextInput 
                    placeholder="••••••••" 
                    value={password} 
                    onChangeText={setPassword} 
                    className="flex-1 ml-3 text-base"
                    placeholderTextColor={colors.placeholderText}
                    secureTextEntry={!showPassword}
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
                <View className="mt-6" style={{}}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 }
});