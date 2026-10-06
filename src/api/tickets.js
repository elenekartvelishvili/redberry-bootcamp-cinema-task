import { request } from './client';

export const getTickets = () => request('/tickets');

export const refundOrder = (orderId) => request(`/orders/${orderId}/refund`, { method: 'POST' });