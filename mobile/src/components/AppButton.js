import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Componente reutilizable de botón para la aplicación.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - El texto que se mostrará en el botón.
 * @param {function} props.onPress - Función a ejecutar cuando se presiona el botón.
 * @param {boolean} [props.isPrimary=false] - Indica si el botón es primario (por defecto, es secundario).
 * @returns {JSX.Element} El componente de botón.
 */
const AppButton = ({ title, onPress, isPrimary = false }) => (
  <TouchableOpacity
    style={[
      styles.button,
      isPrimary ? styles.primary : styles.secondary,
      isPrimary ? { backgroundColor: '#007bff' } : null,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.text, isPrimary ? { color: 'white', fontWeight: 'bold' } : { color: '#007bff', fontWeight: 'bold' }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  primary: {
    backgroundColor: '#007bff',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#007bff',
    borderWidth: 3,
  },
  text: {
    fontSize: 16,
  },
});

export default AppButton;
