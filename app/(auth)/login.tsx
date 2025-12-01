import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'expo-router';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <View style={styles.container}>
      <Text style={styles.title}>CardZenith Login</Text>
      
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

      <Button title={loading ? "Cargando..." : "Iniciar Sesión"} onPress={handleLogin} />

      <View style={{ marginTop: 20 }}>
        <Text>¿No tienes cuenta?</Text>
        {/* Link es el equivalente a <Link to="..."> de React Router */}
        <Link href="/register" style={{ color: 'blue', marginTop: 5 }}>
          Regístrate aquí
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 }
});