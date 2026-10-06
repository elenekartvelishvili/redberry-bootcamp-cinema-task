import { request } from './client';

export const getSession = async (sessionId) => (await request(`/sessions/${sessionId}`)).data;

export const getSessionSeats = async (sessionId) =>
  (await request(`/sessions/${sessionId}/seats`)).data;