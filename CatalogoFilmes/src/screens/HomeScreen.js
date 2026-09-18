import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import StandardButton from '../components/StandardButton';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [typedYear, setTypedYear] = useState(''); // Estado para o ano digitado
  const [sortBy, setSortBy] = useState('default'); // default, az, za

  async function loadMovies() {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await getMovies();
      setMovies(response.data);
    } catch (err) {
      setErrorMessage('Falha na conexão. Verifique sua internet ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMovies(); }, []);

  const availableGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach(m => m.genres?.forEach(g => genres.add(g)));
    return ['Todos', ...Array.from(genres).sort()];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim() !== '') {
      result = result.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedGenre !== 'Todos') {
      result = result.filter(m => m.genres?.includes(selectedGenre));
    }

    if (typedYear.trim().length === 4) {
      result = result.filter(m => m.premiered && m.premiered.substring(0, 4) === typedYear);
    }

    if (sortBy === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [movies, searchQuery, selectedGenre, typedYear, sortBy]);

  const hasActiveFilters = selectedGenre !== 'Todos' || typedYear.trim().length === 4 || sortBy !== 'default';

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

  let emptyMessage = "Nenhum filme corresponde aos filtros selecionados.";
  if (searchQuery) {
    emptyMessage = `Nenhum filme corresponde à pesquisa "${searchQuery}".`;
  } else if (typedYear.length === 4) {
    emptyMessage = `Não encontramos filmes lançados no ano de ${typedYear}.`;
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar filme..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.filterIconButton, hasActiveFilters && styles.filterIconButtonActive]} 
          onPress={() => setFilterModalVisible(true)}
        >
          <FontAwesome name="filter" size={20} color={hasActiveFilters ? colors.textPrimary : colors.accent} />
          {hasActiveFilters && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {filteredMovies.length === 0 ? (
        <EmptyState 
          iconName="film" 
          title="Filme não encontrado" 
          message={emptyMessage}
        />
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros e Ordenação</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                <FontAwesome name="times" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              
              <Text style={styles.sectionTitle}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                {availableGenres.map(genre => (
                  <TouchableOpacity 
                    key={genre} 
                    style={[styles.filterChip, selectedGenre === genre && styles.filterChipActive]}
                    onPress={() => setSelectedGenre(genre)}
                  >
                    <Text style={[styles.filterChipText, selectedGenre === genre && styles.filterChipTextActive]}>{genre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

             
              <Text style={styles.sectionTitle}>Ano de Lançamento</Text>
              <TextInput
                style={styles.yearInput}
                placeholder="Digite o ano (Ex: 2012)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={4}
                value={typedYear}
                onChangeText={setTypedYear}
              />

             
              <Text style={styles.sectionTitle}>Ordem Alfabética</Text>
              <View style={styles.sortContainer}>
                <TouchableOpacity 
                  style={[styles.sortButton, sortBy === 'default' && styles.sortButtonActive]} 
                  onPress={() => setSortBy('default')}
                >
                  <Text style={[styles.sortButtonText, sortBy === 'default' && styles.sortButtonTextActive]}>Padrão</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.sortButton, sortBy === 'az' && styles.sortButtonActive]} 
                  onPress={() => setSortBy('az')}
                >
                  <Text style={[styles.sortButtonText, sortBy === 'az' && styles.sortButtonTextActive]}>A - Z</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.sortButton, sortBy === 'za' && styles.sortButtonActive]} 
                  onPress={() => setSortBy('za')}
                >
                  <Text style={[styles.sortButtonText, sortBy === 'za' && styles.sortButtonTextActive]}>Z - A</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => {
                  setSelectedGenre('Todos');
                  setTypedYear('');
                  setSortBy('default');
                }}
              >
                <Text style={styles.clearButtonText}>Limpar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: colors.textSecondary, marginTop: 15, fontSize: 16 },
  errorText: { color: colors.textPrimary, fontSize: 16, marginBottom: 20, textAlign: 'center', lineHeight: 24 },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: 10,
    fontSize: 16,
  },
  filterIconButton: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  filterIconButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  activeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
  closeButton: { padding: 4 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginTop: 16, marginBottom: 12 },
  
  filtersScroll: { flexGrow: 0, marginBottom: 16 },
  filterChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterChipText: { color: colors.textSecondary, fontWeight: 'bold' },
  filterChipTextActive: { color: colors.textPrimary },

  yearInput: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },

  sortContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  sortButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  sortButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortButtonText: { color: colors.textSecondary, fontWeight: 'bold' },
  sortButtonTextActive: { color: colors.textPrimary },

  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20 },
  clearButton: { flex: 1, padding: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 8 },
  clearButtonText: { color: colors.textPrimary, fontWeight: 'bold' },
  applyButton: { flex: 2, padding: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: 8 },
  applyButtonText: { color: colors.textPrimary, fontWeight: 'bold', fontSize: 16 },

  list: { padding: 8 },
  row: { flex: 1, justifyContent: 'space-around' },
});
