import { api } from './client';

export function listCourts(params = {}) {
  return api('/courts', { query: { limit: 20, ...params } });
}

export function getCourt(courtId) {
  return api(`/courts/${courtId}`);
}

export function getCourtSlots(courtId, slotDate) {
  return api(`/courts/${courtId}/slots`, { query: { slot_date: slotDate } });
}

export function getCourtReviews(courtId) {
  return api(`/courts/${courtId}/reviews`);
}

export function createReview(courtId, body) {
  return api(`/courts/${courtId}/reviews`, { method: 'POST', auth: true, body });
}

export function getCategories() {
  return api('/categories');
}
