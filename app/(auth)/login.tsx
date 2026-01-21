import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from 'constants/colors';

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
        colors={[COLORS.background, COLORS.secondary, COLORS.primaryDark]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ width: '100%', maxWidth: 550 }}>
          {/* Título con icono */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="bg-white/20 rounded-full p-3 mr-3">
              <MaterialCommunityIcons name={fraseAleatoria.icono as any} size={40} color="white" />
            </View>
            <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>
              TopFive
            </Text>
          </View>
          
          {/* Frase aleatoria */}
          <Text style={{fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'white', opacity: 0.9, fontStyle: 'italic'}}>
            {" " +fraseAleatoria.texto}
          </Text>
          
          <View className="bg-white/95 rounded-3xl p-6 shadow-2xl">
              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-black-700 font-semibold mb-2 ml-1">Email</Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                  <MaterialCommunityIcons name="email-outline" size={24} color="#9CA3AF" />
                  <TextInput 
                    placeholder="tu@email.com" 
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <Text className="text-black-700 font-semibold mb-2 ml-1">Contraseña</Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                  <MaterialCommunityIcons name="lock-outline" size={24} color="#9CA3AF" />
                  <TextInput 
                    placeholder="••••••••" 
                    value={password} 
                    onChangeText={setPassword} 
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
                <View className="mt-6" style={{}}>
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    className="bg-accent overflow-hidden rounded-xl shadow-lg py-4 items-center"
                  >
                    <Text className="text-primaryText font-bold text-lg">
                      {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center'}}>
            <Text className="text-primaryText text-base mb-2">¿No tienes cuenta?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/register')}
              className="bg-white/20 px-6 py-3 rounded-full"
            >
              <Text className="text-primaryText font-semibold text-base">Regístrate aquí</Text>
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