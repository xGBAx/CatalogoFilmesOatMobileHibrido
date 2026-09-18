import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import StorageManager from '../utils/storage';
import { colors } from '../theme/colors';

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function loadHistory() {
        const savedData = await StorageManager.getHistory();
        setHistory(savedData);
      }
      loadHistory();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {history.length === 0 ? (
        <EmptyState 
          iconName="hourglass-half" 
          title="Nenhum histórico" 
          message="Você ainda não acessou os detalhes de nenhum filme." 
        />
      ) : (
        <FlatList
          data={history}
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
  list: { padding: 8 },
  row: { flex: 1, justifyContent: 'space-around' },
});