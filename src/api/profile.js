import { request } from './client';

export const updateProfile = (values) => request('/profile', { method: 'PUT', body: values });