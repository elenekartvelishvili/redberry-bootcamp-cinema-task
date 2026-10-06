import { request } from './client';

export const getNowPlaying = async () => {
  const response = await request('/movies/now-playing');
  return response.data;
};

export const getComingSoon = async () => {
  const response = await request('/movies/coming-soon');
  return response.data;
};

export const getFeatured = async () => {
  const response = await request('/movies/featured');
  return response.data;
};

export const getMovie = async (slug) => {
  const response = await request(`/movies/${slug}`);
  return response.data;
};

export const getMovieSessions = async (slug, date) => {
  const response = await request(`/movies/${slug}/sessions`, { params: { date } });
  return response.data;
};

export const notifyMovie = (slug) => request(`/movies/${slug}/notify`, { method: 'POST' });