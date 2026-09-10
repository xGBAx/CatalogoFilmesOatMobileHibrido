import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import StandardButton from '../components/StandardButton';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadMovies() {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await getMovies();
      setMovies(response.data);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status >= 400 && status < 500) setErrorMessage('Erro na requisição. Não foi possível carregar a lista (Erro 400).');
        else if (status >= 500) setErrorMessage('O servidor da API está instável no momento (Erro 500).');
        else setErrorMessage('Ocorreu um erro inesperado ao carregar o catálogo.');
      } else {
        setErrorMessage('Falha na conexão. Verifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMovies(); }, []);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando catálogo...</Text>
    </View>
  );

  if (errorMessage !== '') return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <StandardButton title="Tentar Novamente" onPress={loadMovies} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 8 },
  row: { flex: 1, justifyContent: 'space-around' },
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: colors.textSecondary, marginTop: 15, fontSize: 16 },
  errorText: { color: colors.textPrimary, fontSize: 16, marginBottom: 20, textAlign: 'center', lineHeight: 24 }
});