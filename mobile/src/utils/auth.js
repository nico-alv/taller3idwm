import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

/**
 * Almacena un token en AsyncStorage.
 *
 * @param {string} token - El token JWT que se va a almacenar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el token se almacena con éxito.
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('jwtToken', token);
  } catch (error) {
    console.error('Error al almacenar el token:', error);
  }
};

/**
 * Obtiene un token almacenado en AsyncStorage.
 *
 * @returns {Promise<string|null>} Una promesa que se resuelve con el token almacenado o null si no se encuentra.
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('jwtToken');
  } catch (error) {
    console.error('Error al obtener el token:', error);
  }
};

/**
 * Elimina un token almacenado en AsyncStorage.
 *
 * @returns {Promise<void>} Una promesa que se resuelve cuando el token se elimina con éxito.
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('jwtToken');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  }
};

/**
 * Verifica si un token JWT está expirado.
 *
 * @returns {Promise<boolean>} Una promesa que se resuelve con true si el token está expirado o false si no lo está.
 */
export const isTokenExpired = async () => {
  try {
    const token = await getToken();
    if (!token) return true;

    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return true;
  }
};
