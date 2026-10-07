import { request } from './client';

export const getTickets = async () => {
  const response = await request('/tickets');
  return response.data;
};

export const refundOrder = async (reference) => {
  const response = await request(`/orders/${reference}/refund`, { method: 'POST' });
  return response.data;
};