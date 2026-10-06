import { request } from './client';

export const getSessions = (filters) => request('/sessions', { params: filters });