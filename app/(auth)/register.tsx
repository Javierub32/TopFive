import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const {showNotification, hideNotification} = useNotification();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const { colors } = useTheme();

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        //Alert.alert('Error', 'Las contraseñas no coinciden. \n Por favor, inténtalo de nuevo.');
        showNotification({
          title: 'Error',
          description: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.',
          isChoice: false,
          delete: false,
          success: false,
        });
        setLoading(false);
        return;
      }
      await signUp(email, password, username.trim());
      router.replace('/(auth)/login');
      showNotification({
        title: 'Cuenta creada',
        description: (
          <Text>
            Tu cuenta ha sido creada exitosamente. {"\n"}
            Revisa la bandeja de <Text style={{ fontWeight: 'bold' }}>SPAM</Text> y confirma tu correo.
          </Text>
        ),
        isChoice: true, 
        rightButtonText: 'Aceptar',
        onRightPress: () => {
          hideNotification();
          router.push('/(auth)/login'); 
        },
        delete: false,
        success: true,
      });
    
  } catch (error: any) {
	  //Alert.alert('Error', error.message || 'Hubo un error al crear tu cuenta.');
      showNotification({
        title: 'Error',
        description: error.message || 'Hubo un error al crear tu cuenta.',
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
	<ScrollView 
	  className='flex-1' 
	  contentContainerStyle={{ flexGrow: 1 }}
	  showsVerticalScrollIndicator={false}
	>
      <LinearGradient
        colors={[colors.background, colors.secondary, colors.secondary]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ width: '100%', maxWidth: 550 }}>
          <View className="flex-row items-center justify-center mb-4">
					  <View className="rounded-full p-3 mr-3" style= {{backgroundColor: `${colors.primaryText}20`}}>
						<MaterialCommunityIcons name="movie-open" size={40} color={colors.primaryText} />
					  </View>
					  <Text style={{fontSize: 24, fontWeight: 'bold', color: colors.primaryText}}>
						TopFive
					  </Text>
					</View>

          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: 'center',
              color: colors.primaryText,
              opacity: 0.9,
              fontStyle: 'italic',
            }}>
            Crea tu cuenta
          </Text>

          <View className="rounded-3xl p-6 shadow-2xl" style={{backgroundColor: colors.background}}>
            {/* Username Input */}
            <View className="mb-4">
              <Text className="mb-2 ml-1 font-semibold" style={{color: colors.primaryText}}>Nombre de usuario</Text>
              <View className="flex-row items-center rounded-xl px-4 py-3 mb-3" style={{backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="account-outline" size={24} color={colors.secondaryText} />
                <TextInput
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  style={{color: colors.primaryText}}
                />
              </View>
              <Text className="mb-2 ml-1 font-semibold" style={{color: colors.primaryText}}>Email</Text>
              <View className="flex-row items-center rounded-xl px-4 py-3 mb-3" style={{backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="email-outline" size={24} color={colors.secondaryText} />
                <TextInput
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  style={{color: colors.primaryText}}
                />
              </View>
              <Text className="mb-2 ml-1 font-semibold" style={{color: colors.primaryText}}>Contraseña</Text>
              <View className="flex-row items-center rounded-xl px-4 py-3" style={{backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry={!showPassword}
				  style={{flex: 1, marginLeft: 12, marginRight: 8, color: colors.primaryText, minWidth: 0}}
				/>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={!showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              <Text className="mb-2 ml-1 mt-4 font-semibold" style={{color: colors.primaryText}}>Confirmar contraseña</Text>
              <View className="flex-row items-center rounded-xl px-4 py-3" style={{backgroundColor: colors.surfaceButton}}>
                <MaterialCommunityIcons name="lock-outline" size={24} color={colors.secondaryText} />
                <TextInput
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor={colors.placeholderText}
                  secureTextEntry={!showPassword}
				  style={{flex: 1, marginLeft: 12, marginRight: 8, color: colors.primaryText, minWidth: 0}}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                  <MaterialCommunityIcons
                    name={!showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.secondaryText}
                  />
                </TouchableOpacity>
              </View>

              <View className="mt-6">
                <TouchableOpacity
                  onPress={handleRegister}
                  disabled={loading}
                  className="overflow-hidden rounded-xl shadow-lg py-4 items-center"
                  style={{backgroundColor: colors.accent}}>
                    <Text className="text-lg font-bold" style={{color: colors.primaryText}}>
                      {loading ? 'Creando...' : 'Registrarse'}
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text className="mb-2 text-base" style={{color: colors.primaryText}}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="rounded-full px-6 py-3" style={{backgroundColor: `${colors.surfaceButton}80`}}>
              <Text className="text-base font-semibold" style={{color: colors.primaryText}}>Volver al Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
