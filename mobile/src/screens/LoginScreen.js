import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import api from '../api/api';
import { storeToken } from '../utils/auth';
import { API_URL } from '@env';

/**
 * Pantalla de inicio de sesión de la aplicación.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación proporcionado por React Navigation.
 * @returns {JSX.Element} El componente de la pantalla de inicio de sesión.
 */
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Maneja la acción de inicio de sesión del usuario.
   */
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
      }
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await storeToken(data.token);
        navigation.navigate('RepositoryListScreen');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleLogin}
        style={styles.button}
      >
        Iniciar sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginBottom: 10,
    backgroundColor: 'grey',
  },
});

export default LoginScreen;
