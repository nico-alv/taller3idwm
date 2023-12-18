import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * Componente reutilizable de campo de entrada de texto.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.label - Etiqueta que se mostrará junto al campo de entrada.
 * @param {string} props.value - Valor actual del campo de entrada.
 * @param {function} props.onChangeText - Función a ejecutar cuando cambie el texto en el campo de entrada.
 * @param {boolean} [props.secureTextEntry=false] - Indica si el campo de entrada debe ocultar el texto (por defecto, es falso).
 * @returns {JSX.Element} El componente del campo de entrada de texto.
 */
const InputField = ({ label, value, onChangeText, secureTextEntry = false }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});

export default InputField;
