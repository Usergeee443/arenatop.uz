import { api } from './client';

export function listPaymentCards() {
  return api('/payment-cards', { auth: true });
}

export function createPaymentCard(body) {
  return api('/payment-cards', { method: 'POST', auth: true, body });
}

export function updatePaymentCard(cardId, body) {
  return api(`/payment-cards/${cardId}`, { method: 'PATCH', auth: true, body });
}

export function deletePaymentCard(cardId) {
  return api(`/payment-cards/${cardId}`, { method: 'DELETE', auth: true });
}
