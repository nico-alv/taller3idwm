import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { API_URL } from '@env';
import { getToken } from '../utils/auth';

/**
 * Pantalla de perfil de usuario.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación proporcionado por React Navigation.
 * @returns {JSX.Element} El componente de la pantalla de perfil de usuario.
 */
const ProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  /**
   * Maneja la actualización del perfil de usuario.
   */
  const handleUpdateProfile = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch(`${API_URL}/api/update-profile`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          birthday: birthday,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      } else {
        Alert.alert('Error', data.error || 'Ha ocurrido un error al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

  
  /**
   * Maneja el cierre de sesión del usuario.
   */
  const handleLogout = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Sesión cerrada correctamente.');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Error', 'Ha ocurrido un error al cerrar la sesión.');
      }
    } catch (error) {
      console.error('Error al cerrar la sesión:', error);
    }
  };

  /**
   * Maneja el cambio de contraseña del usuario.
   */
  const handleChangePassword = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      const response = await fetch(`${API_URL}/api/change-password`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Contraseña cambiada correctamente.');
      } else {
        Alert.alert('Error', data.error || 'Ha ocurrido un error al cambiar la contraseña.');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Fecha de Nacimiento"
        value={birthday}
        onChangeText={setBirthday}
        mode="outlined"
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleUpdateProfile}
        style={styles.button}
      >
        Actualizar Perfil
      </Button>
  
      <TextInput
        label="Contraseña Actual"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Nueva Contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Confirmar Nueva Contraseña"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={handleChangePassword}
        style={styles.button}
      >
        Cambiar Contraseña
      </Button>

      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.button}
      >
        Cerrar Sesión
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
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginBottom: 10,
    backgroundColor: 'grey',
  },
});

export default ProfileScreen;
