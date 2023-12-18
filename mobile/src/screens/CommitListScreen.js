import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GITHUB_API_KEY } from '@env';

/**
 * Pantalla que muestra la lista de commits de un repositorio en GitHub.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.route - Información de navegación de la pantalla.
 * @param {string} props.route.params.repoName - Nombre del repositorio para el que se muestran los commits.
 * @returns {JSX.Element} El componente de la lista de commits.
 */
const CommitListScreen = ({ route }) => {
  const { repoName } = route.params;
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    /**
     * Recupera la lista de commits de un repositorio en GitHub.
     */
    const fetchCommits = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/Dizkm8/${repoName}/commits`, {
          headers: {
            Authorization: `token ${GITHUB_API_KEY}`,
          },
        });
        const data = await response.json();
        setCommits(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommits();
  }, [repoName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commits de {repoName}</Text>
      <FlatList
        data={commits}
        keyExtractor={(commit) => commit.sha}
        renderItem={({ item }) => (
          <View style={styles.commitContainer}>
            <Text>{item.commit.message}</Text>
            <Text style={styles.date}>{new Date(item.commit.committer.date).toLocaleDateString()}</Text>
          </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commitContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: 'grey',
  },
});

export default CommitListScreen;
