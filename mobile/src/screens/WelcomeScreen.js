/**
 * Pantalla de bienvenida.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación de React Navigation.
 * @returns {JSX.Element} Elemento de React que representa la pantalla de bienvenida.
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppButton from '../components/AppButton';

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>MobileHub</Text>
    <Image source={require('../../assets/logo.png')} style={styles.logo} />
    <AppButton
      title="Iniciar sesión"
      onPress={() => navigation.navigate('LoginScreen')}
      isPrimary
    />
    <AppButton
      title="Registrarse"
      onPress={() => navigation.navigate('RegisterScreen')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
});

export default WelcomeScreen;
