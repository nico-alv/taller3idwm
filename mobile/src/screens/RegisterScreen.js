/**
 * @format
 * @flow
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import { API_URL } from '@env';

/**
 * Pantalla de registro de usuario.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación de React Navigation.
 * @returns {React.Node} - Componente de registro.
 */
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isDniValid, setIsDniValid] = useState(true);
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isBirthdayValid, setIsBirthdayValid] = useState(true);

  /**
   * Valida una dirección de correo electrónico.
   *
   * @param {string} email - Correo electrónico a validar.
   * @returns {boolean} - True si el correo es válido, de lo contrario, False.
   */
  const validateEmail = (email) => {
    const emailPattern = /^[^@]+@(ucn\.cl|alumnos\.ucn\.cl|disc\.ucn\.cl|ce\.ucn\.cl)$/i;
    const isValid = emailPattern.test(email);
    setIsEmailValid(isValid);
    console.log('Validación de Email:', isValid);
    return isValid;
  };

  /**
   * Valida un RUT chileno.
   *
   * @param {string} rut - RUT a validar.
   * @returns {boolean} - True si el RUT es válido, de lo contrario, False.
   */
  const validateRut = (rut) => {
    const rutPattern = /^(\d{1,3}(\.?\d{3}){0,2}-[\dkK])$/;
    if (!rutPattern.test(rut)) {
      setIsDniValid(false);
      console.log('Validación de RUT: Formato incorrecto');
      return false;
    }

    let [numbers, verifier] = rut.split('-');
    numbers = numbers.replace(/\./g, '');
    let sum = 0;
    let multiplier = 2;

    for (let i = numbers.length - 1; i >= 0; i--) {
      sum += numbers[i] * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    let calculatedVerifier = 11 - (sum % 11);
    calculatedVerifier = calculatedVerifier === 11 ? '0' : calculatedVerifier === 10 ? 'K' : calculatedVerifier.toString();

    const isValid = verifier.toUpperCase() === calculatedVerifier;
    setIsDniValid(isValid);
    console.log('Validación de RUT:', isValid);
    return isValid;
  };

  /**
   * Valida un nombre completo.
   *
   * @param {string} fullName - Nombre completo a validar.
   * @returns {boolean} - True si el nombre completo es válido, de lo contrario, False.
   */
  const validateFullName = (fullName) => {
    const isValid = fullName.trim().length >= 10 && fullName.trim().length <= 150;
    setIsFullNameValid(isValid);
    console.log('Validación de Nombre Completo:', isValid);
    return isValid;
  };

  /**
   * Valida una fecha de nacimiento en formato "DD-MM-YYYY".
   *
   * @param {string} birthday - Fecha de nacimiento a validar.
   * @returns {boolean} - True si la fecha de nacimiento es válida, de lo contrario, False.
   */
  const validateBirthday = (birthday) => {
    const birthdayPattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!birthdayPattern.test(birthday)) {
      setIsBirthdayValid(false);
      console.log('Validación de Fecha de Nacimiento: Formato incorrecto');
      return false;
    }

    const [day, month, year] = birthday.split('-');
    const birthdayDate = new Date(year, month - 1, day);
    const now = new Date();
    const isValid = birthdayDate <= now;
    setIsBirthdayValid(isValid);
    console.log('Validación de Fecha de Nacimiento:', isValid);
    return isValid;
  };

  /**
   * Maneja el registro del usuario.
   */
  const handleRegister = async () => {
    console.log(`${API_URL}/api/auth/register`)
    const isEmailOk = validateEmail(email);
    const isDniOk = validateRut(dni);
    const isFullNameOk = validateFullName(fullName);
    const isBirthdayOk = validateBirthday(birthday);

    if (!isEmailOk || !isDniOk || !isFullNameOk || !isBirthdayOk) {
      Alert.alert('Error', 'Datos inválidos');
      console.log('Error en la validación: Email:', isEmailOk, 'DNI:', isDniOk, 'Nombre Completo:', isFullNameOk, 'Fecha de Nacimiento:', isBirthdayOk);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          dni,
          full_name: fullName,
          birthday,
          password,
        }),
      });
      console.log(response);
      if (response.ok) {
        navigation.navigate('RepositoryListScreen');
      } else {
        Alert.alert('Error', 'No se pudo registrar');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      Alert.alert('Error', 'No se pudo registrar');
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Correo Electrónico"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
        errorMessage={!isEmailValid && 'Correo inválido'}
      />
      <InputField
        label="RUT"
        value={dni}
        onChangeText={(text) => {
          setDni(text);
          validateRut(text);
        }}
        errorMessage={!isDniValid && 'RUT inválido'}
      />
      <InputField
        label="Nombre Completo"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          validateFullName(text);
        }}
        errorMessage={!isFullNameValid && 'Nombre inválido'}
      />
      <InputField
        label="Año de Nacimiento (DD-MM-YYYY)"
        value={birthday}
        onChangeText={(text) => {
          setBirthday(text);
          validateBirthday(text);
        }}
        errorMessage={!isBirthdayValid && 'Fecha inválida'}
      />
      <InputField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton title="Registrarse" onPress={handleRegister} isPrimary />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default RegisterScreen;
