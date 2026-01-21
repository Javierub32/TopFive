import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from 'constants/colors';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Registering user:', { username, email, password });
      await signUp(email, password, username);

      Alert.alert('Cuenta Creada', 'Por favor confirma tu email antes de iniciar sesión.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: string | any) {
      Alert.alert(
        'Error Registro',
        error.message || 'El nombre de usuario o correo ya está registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[COLORS.background, COLORS.secondary, COLORS.primaryDark]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ width: '100%', maxWidth: 550 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
              textAlign: 'center',
              color: 'white',
            }}>
            TopFive
          </Text>

          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
              color: 'white',
              opacity: 0.9,
              fontStyle: 'italic',
            }}>
            Crea tu cuenta
          </Text>

          <View className="rounded-3xl bg-white/95 p-6 shadow-2xl">
            {/* Username Input */}
            <View className="mb-4">
              <Text className="text-black-700 mb-2 ml-1 font-semibold">Nombre de usuario</Text>
              <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                <MaterialCommunityIcons name="account-outline" size={24} color="#9CA3AF" />
                <TextInput
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="ml-3 flex-1 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text className="text-black-700 mb-2 ml-1 font-semibold">Email</Text>
              <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                <MaterialCommunityIcons name="email-outline" size={24} color="#9CA3AF" />
                <TextInput
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="ml-3 flex-1 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <Text className="text-black-700 mb-2 ml-1 font-semibold">Contraseña</Text>
              <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                <MaterialCommunityIcons name="lock-outline" size={24} color="#9CA3AF" />
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  className="ml-3 flex-1 text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              <View className="mt-6">
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className="bg-accent overflow-hidden rounded-xl shadow-lg py-4 items-center">
                    <Text className="text-lg font-bold text-primaryText">
                      {loading ? 'Creando...' : 'Registrarse'}
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text className="mb-2 text-base text-primaryText">¿Ya tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="rounded-full bg-white/20 px-6 py-3">
              <Text className="text-base font-semibold text-primaryText">Volver al Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
