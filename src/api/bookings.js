import { api } from './client';

export function createBooking({ court_id, time_slot_ids }) {
  return api('/bookings', {
    method: 'POST',
    auth: true,
    body: { court_id, time_slot_ids },
  });
}

export function listMyBookings(params = {}) {
  return api('/bookings', { auth: true, query: params });
}

export function getBooking(bookingId) {
  return api(`/bookings/${bookingId}`, { auth: true });
}

export function cancelBooking(bookingId, note) {
  return api(`/bookings/${bookingId}/cancel`, {
    method: 'POST',
    auth: true,
    body: { note: note || 'Bekor qilindi' },
  });
}

export function calculatePayment({ court_id, slot_count = 1, slot_date }) {
  return api('/bookings/calculate', {
    query: { court_id, slot_count, slot_date },
  });
}

export function createPayment({ booking_id, method = 'payme', court_amount }) {
  return api('/payments/create', {
    method: 'POST',
    auth: true,
    body: { booking_id, method, court_amount },
  });
}

export function getPaymentMethods() {
  return api('/payments/methods', { auth: true });
}

export function listMyPayments(params = {}) {
  return api('/payments/my', { auth: true, query: { limit: 50, ...params } });
}

export function listMyRefunds() {
  return api('/bookings/refunds', { auth: true });
}

export function submitRefundRequest(bookingId, body) {
  return api(`/bookings/${bookingId}/refund-request`, {
    method: 'POST',
    auth: true,
    body,
  });
}
