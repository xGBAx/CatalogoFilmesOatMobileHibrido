import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import StorageManager from '../utils/storage';
import { colors } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadFavs() {
        setLoading(true);
        const data = await StorageManager.getFavorites();
        setFavorites(data || []);
        setLoading(false);
      }
      loadFavs();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {favorites.length === 0 ? (
        <EmptyState 
          iconName="star-o" 
          title="Nenhum favorito" 
          message="Você ainda não adicionou nenhum filme à sua lista de favoritos." 
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 8 },
  row: { flex: 1, justifyContent: 'space-around' },
});