import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

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
      // Llamamos a nuestra función manual
      await signUp(email, password, username);
      
      Alert.alert(
        'Cuenta Creada', 
        'Por favor confirma tu email antes de iniciar sesión.',
        [
            { text: "OK", onPress: () => router.back() } // Volver al login
        ]
      );
    } catch (error: string | any) {
      Alert.alert('Error Registro', 'El nombre de usuario o correo ya está registrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput 
        placeholder="Nombre de usuario" 
        value={username} 
        onChangeText={setUsername} 
        style={styles.input} 
      />
      
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
        style={styles.input} 
      />
      <TextInput 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />

      <Button title={loading ? "Creando..." : "Registrarse"} onPress={handleRegister} />
      
      <Button title="Volver al Login" onPress={() => router.back()} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 }
});