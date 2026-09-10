import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getMovieById } from '../services/api';
import { formatReleaseDate } from '../utils/formatters';
import StandardButton from '../components/StandardButton';
import { colors } from '../theme/colors';

export default function DetailsScreen({ route }) {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadDetails() {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await getMovieById(id);
      setMovieDetails(response.data);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 404) setErrorMessage('Os detalhes deste filme não foram encontrados (Erro 404).');
        else if (status >= 500) setErrorMessage('Erro no servidor ao buscar detalhes (Erro 500).');
        else setErrorMessage('Ocorreu um erro ao carregar os detalhes do filme.');
      } else {
        setErrorMessage('Falha na conexão. Verifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDetails(); }, [id]);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Buscando informações...</Text>
    </View>
  );

  if (errorMessage !== '' || !movieDetails) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <StandardButton title="Tentar Novamente" onPress={loadDetails} />
    </View>
  );

  const imageUrl = movieDetails.image ? movieDetails.image.original : 'https://via.placeholder.com/400x600?text=Sem+Capa';
  const cleanSummary = movieDetails.summary ? movieDetails.summary.replace(/<[^>]+>/g, '') : 'Sinopse não disponível.';
  const rating = movieDetails.rating?.average || 'N/A';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{movieDetails.name}</Text>
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={18} color={colors.star} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          {/* Aplicação da função formatadora exigida pelo teste unitário do slide */}
          <Text style={styles.metaText}>{formatReleaseDate(movieDetails.premiered)}</Text>
          <Text style={styles.metaText}>{movieDetails.genres?.join(', ')}</Text>
        </View>
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.summary}>{cleanSummary}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  poster: { width: '100%', height: 450 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 },
  metaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  metaText: { color: colors.textSecondary, fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 },
  summary: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
  loadingText: { color: colors.textSecondary, marginTop: 15, fontSize: 16 },
  errorText: { color: colors.textPrimary, fontSize: 16, marginBottom: 20, textAlign: 'center', lineHeight: 24 }
});