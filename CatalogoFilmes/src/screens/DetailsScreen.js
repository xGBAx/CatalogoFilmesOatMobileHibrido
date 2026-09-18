import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getMovieById } from '../services/api';
import { formatReleaseDate } from '../utils/formatters';
import StorageManager from '../utils/storage';
import StandardButton from '../components/StandardButton';
import { colors } from '../theme/colors';

export default function DetailsScreen({ route }) {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFav, setIsFav] = useState(false);

  async function loadDetails() {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await getMovieById(id);
      setMovieDetails(response.data);
      
      await StorageManager.saveToHistory(response.data);
      const favStatus = await StorageManager.isMovieFavorite(response.data.id);
      setIsFav(favStatus);
      
    } catch (err) {
      setErrorMessage('Falha na conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDetails(); }, [id]);

  async function handleToggleFavorite() {
    if (!movieDetails) return;
    const newStatus = await StorageManager.toggleFavorite(movieDetails);
    setIsFav(newStatus);
  }

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

  const imageUrl = movieDetails.image?.original || movieDetails.image?.medium || 'https://via.placeholder.com/400x600/1A1A1A/FF8C00?text=Sem+Capa';
  const cleanSummary = movieDetails.summary ? movieDetails.summary.replace(/<[^>]+>/g, '') : 'Sinopse não disponível.';
  const rating = movieDetails.rating?.average || 'N/A';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movieDetails.name}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
            <FontAwesome name={isFav ? "star" : "star-o"} size={32} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={18} color={colors.star} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
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
  imageContainer: { width: '100%', backgroundColor: '#000', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary, flex: 1, marginRight: 10 },
  favButton: { padding: 4 },
  metaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15, flexWrap: 'wrap' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: { color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  metaText: { color: colors.textSecondary, fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 },
  summary: { color: colors.textSecondary, fontSize: 16, lineHeight: 24 },
  loadingText: { color: colors.textSecondary, marginTop: 15, fontSize: 16 },
  errorText: { color: colors.textPrimary, fontSize: 16, marginBottom: 20, textAlign: 'center', lineHeight: 24 }
});