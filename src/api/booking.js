import { request } from './client';

export const getSession = async (sessionId) => {
  const response = await request(`/sessions/${sessionId}`);
  return response.data;
};

export const getSessionSeats = async (sessionId) => {
  const response = await request(`/sessions/${sessionId}/seats`);
  return response.data;
};

export const holdSeats = async (sessionId, seats) => {
  const response = await request(`/sessions/${sessionId}/holds`, {
    method: 'POST',
    body: { seats },
  });
  return response.data;
};

export const createOrder = async (details) => {
  const response = await request('/orders', { method: 'POST', body: details });
  return response.data;
};