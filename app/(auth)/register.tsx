import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter(); 
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if(!username || !email || !password) {
        Alert.alert("Error", "Por favor llena todos los campos");
        return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      
      Alert.alert(
        'Cuenta Creada', 
        'Por favor confirma tu email antes de iniciar sesión.',
        [
            { text: "OK", onPress: () => router.back() }
        ]
      );
    } catch (error: string | any) {
      Alert.alert('Error Registro', 'El nombre de usuario o correo ya está registrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1'>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ width: '100%', maxWidth: 550 }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'white'}}>
            TopFive
          </Text>
          
          <Text style={{fontSize: 14, marginBottom: 20, textAlign: 'center', color: 'white', opacity: 0.9, fontStyle: 'italic'}}>
            Crea tu cuenta
          </Text>
          
          <View className="bg-white/95 rounded-3xl p-6 shadow-2xl">
              {/* Username Input */}
              <View className="mb-4">
                <Text className="text-black-700 font-semibold mb-2 ml-1">Nombre de usuario</Text>
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                  <MaterialCommunityIcons name="account-outline" size={24} color="#9CA3AF" />
                  <TextInput 
                    placeholder="Tu nombre de usuario" 
                    value={username} 
                    onChangeText={setUsername} 
                    autoCapitalize="none"
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
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
                    secureTextEntry
                  />
                </View>
                <View className="mt-6">
                  <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    className="overflow-hidden rounded-xl shadow-lg"
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="py-4 items-center"
                    >
                    <Text className="text-white font-bold text-lg">
                      {loading ? 'Creando...' : 'Registrarse'}
                    </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center'}}>
            <Text className="text-white text-base mb-2">¿Ya tienes cuenta?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              className="bg-white/20 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold text-base">Volver al Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}