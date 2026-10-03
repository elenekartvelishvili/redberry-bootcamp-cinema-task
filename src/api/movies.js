import { request } from './client';

export const getNowPlaying = async () => (await request('/movies/now-playing')).data;
export const getComingSoon = async () => (await request('/movies/coming-soon')).data;
export const getFeatured = async () => (await request('/movies/featured')).data;
export const getMovie = async (slug) => (await request(`/movies/${slug}`)).data;

export const notifyMovie=(slug)=> request(`/movies/${slug}/notify`, { method: 'POST' });