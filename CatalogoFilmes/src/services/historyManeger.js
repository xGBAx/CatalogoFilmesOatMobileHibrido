import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@catalogo_historico';
const FAVORITES_KEY = '@catalogo_favoritos';

// ================= HISTÓRICO =================
export async function saveToHistory(movie) {
  try {
    const currentHistory = await AsyncStorage.getItem(HISTORY_KEY);
    let historyArray = currentHistory ? JSON.parse(currentHistory) : [];

    historyArray = historyArray.filter((item) => item.id !== movie.id);
    historyArray.unshift(movie);

    if (historyArray.length > 15) {
      historyArray.pop();
    }

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(historyArray));
  } catch (error) {
    console.error('Erro ao salvar no histórico', error);
  }
}

export async function getHistory() {
  try {
    const currentHistory = await AsyncStorage.getItem(HISTORY_KEY);
    return currentHistory ? JSON.parse(currentHistory) : [];
  } catch (error) {
    console.error('Erro ao buscar histórico', error);
    return [];
  }
}

// ================= FAVORITOS =================

export async function getFavorites() {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar favoritos', error);
    return [];
  }
}

export async function isMovieFavorite(movieId) {
  try {
    const currentFavs = await getFavorites();
    return currentFavs.some(m => m.id === movieId);
  } catch (error) {
    return false;
  }
}

export async function toggleFavorite(movie) {
  try {
    const currentFavs = await getFavorites();
    const isFav = currentFavs.find(m => m.id === movie.id);
    
    let newFavs;
    if (isFav) {
      
      newFavs = currentFavs.filter(m => m.id !== movie.id);
    } else {
      newFavs = [movie, ...currentFavs];
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
    return !isFav;
  } catch (error) {
    console.error('Erro ao favoritar', error);
    return false;
  }
}