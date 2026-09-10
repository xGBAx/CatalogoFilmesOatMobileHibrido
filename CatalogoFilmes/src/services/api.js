import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tvmaze.com',
  timeout: 10000, 
});

export const getMovies = async () => {
  return await api.get('/shows?page=1');
};

export const getMovieById = async (id) => {
  return await api.get(`/shows/${id}`);
};

export default api;