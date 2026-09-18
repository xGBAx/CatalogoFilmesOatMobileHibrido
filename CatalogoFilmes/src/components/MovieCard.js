import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function MovieCard({ movie, onPress }) {
  const imageUrl = movie?.image?.medium || 'https://via.placeholder.com/210x295/1A1A1A/FF8C00?text=Sem+Capa';
  const title = movie?.name || 'Filme Desconhecido';
  const year = movie?.premiered ? movie.premiered.substring(0, 4) : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {year !== '' && <Text style={styles.year}>{year}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    flex: 1, 
    margin: 8, 
    backgroundColor: colors.surface, 
    borderRadius: 8, 
    overflow: 'hidden', 
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    maxWidth: '46%' 
  },
  image: { 
    width: '100%', 
    aspectRatio: 0.7, 
  },
  infoContainer: { 
    padding: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    height: 65 
  },
  title: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  year: { 
    color: colors.textSecondary, 
    fontSize: 12, 
    marginTop: 4 
  }
});