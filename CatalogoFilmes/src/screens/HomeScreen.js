import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  RefreshControl,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import StandardButton from '../components/StandardButton';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');

  const fetchMovies = async () => {
    try {
      setErrorMessage('');
      const response = await getMovies();
      setMovies(response.data);
    } catch (err) {
      setErrorMessage('Falha na conexão. Verifique sua internet ou tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true);
      await fetchMovies();
      setLoading(false);
    };
    loadInitialMovies();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  }, []);

  const availableGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach(m => m.genres?.forEach(g => genres.add(g)));
    return ['Todos', ...Array.from(genres).sort()];
  }, [movies]);

  const availableYears = useMemo(() => {
    const years = new Set();
    movies.forEach(m => {
      if (m.premiered) {
        years.add(m.premiered.substring(0, 4));
      }
    });
    return ['Todos', ...Array.from(years).sort((a, b) => b - a)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchQuery.trim() !== '') {
      result = result.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedGenre !== 'Todos') {
      result = result.filter(m => m.genres?.includes(selectedGenre));
    }

    if (selectedYear !== 'Todos') {
      result = result.filter(m => m.premiered && m.premiered.substring(0, 4) === selectedYear);
    }

    if (sortBy === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [movies, searchQuery, selectedGenre, selectedYear, sortBy]);

  const renderMovieItem = useCallback(({ item }) => (
    <MovieCard movie={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
  ), [navigation]);

  const hasActiveFilters = selectedGenre !== 'Todos' || selectedYear !== 'Todos' || sortBy !== 'default';

  if (loading) return (
    <SafeAreaView style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando catálogo...</Text>
    </SafeAreaView>
  );

  if (errorMessage !== '') return (
    <SafeAreaView style={styles.centered}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <StandardButton title="Tentar Novamente" onPress={() => { setLoading(true); fetchMovies().then(() => setLoading(false)); }} />
    </SafeAreaView>
  );

  let emptyMessage = "Nenhum filme corresponde aos filtros selecionados.";
  if (searchQuery) {
    emptyMessage = `Nenhum filme corresponde à pesquisa "${searchQuery}".`;
  } else if (selectedYear !== 'Todos' && selectedGenre !== 'Todos') {
    emptyMessage = `Não encontramos nenhum filme de ${selectedGenre} lançado em ${selectedYear}.`;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* Barra de Pesquisa e Botão de Filtro */}
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

      {/* Listagem ou Estado Vazio */}
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
          renderItem={renderMovieItem}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[colors.primary]} 
              tintColor={colors.primary} 
            />
          }
        />
      )}

      {/* Modal de Filtros Flutuante */}
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                {availableYears.map(year => (
                  <TouchableOpacity 
                    key={year} 
                    style={[styles.filterChip, selectedYear === year && styles.filterChipActive]}
                    onPress={() => setSelectedYear(year)}
                  >
                    <Text style={[styles.filterChipText, selectedYear === year && styles.filterChipTextActive]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

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
                  setSelectedYear('Todos');
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

    </SafeAreaView>
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