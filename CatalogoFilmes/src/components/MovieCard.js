import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function MovieCard({ movie, onPress }) {
  const imageUrl = movie?.image?.medium || 'https://via.placeholder.com/210x295?text=Sem+Capa';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{movie?.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 8, backgroundColor: colors.card, borderRadius: 8, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 10 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }
});