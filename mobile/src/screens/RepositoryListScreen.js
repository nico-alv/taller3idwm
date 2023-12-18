/**
 * Pantalla de lista de repositorios.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación de React Navigation.
 * @returns {JSX.Element} Componente de lista de repositorios.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { GITHUB_API_KEY } from '@env';
import { Button } from 'react-native-paper';

/**
 * Componente funcional que muestra una lista de repositorios de GitHub.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {object} props.navigation - Objeto de navegación de React Navigation.
 * @returns {JSX.Element} Componente de lista de repositorios.
 */
const RepositoryListScreen = ({ navigation }) => {
  const [repositories, setRepositories] = useState([]);

  /**
   * Función que se ejecuta al cargar el componente para obtener la lista de repositorios desde GitHub.
   */
  useEffect(() => {
    /**
     * Obtiene la lista de repositorios desde la API de GitHub.
     * @async
     */
    const fetchRepositories = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Dizkm8/repos', {
          headers: {
            Authorization: `token ${GITHUB_API_KEY}`,
          },
        });        
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ProfileScreen')}
        style={styles.profileButton}
      >
        Ir a Perfil
      </Button>

      <FlatList
        data={repositories}
        keyExtractor={(repo) => repo.id.toString()}
        renderItem={({ item }) => (
          <Button
            onPress={() => navigation.navigate('CommitListScreen', { repoName: item.name })}
            labelStyle={styles.buttonLabel}
            style={styles.repoItem}
          >
            {item.name}
          </Button>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  repoItem: {
    marginVertical: 5,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'black',
    backgroundColor: '#d3d3d3',
  },
  profileButton: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: 'grey'
  },
  buttonLabel: {
    color: 'black',
  },
});

export default RepositoryListScreen;
