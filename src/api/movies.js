import { request } from './client';

export const getNowPlaying = async () => (await request('/movies/now-playing')).data;
export const getComingSoon = async () => (await request('/movies/coming-soon')).data;