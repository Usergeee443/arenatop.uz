import { api } from './client';

export function getSavedCourts(params = {}) {
  return api('/users/saved-courts', { auth: true, query: { limit: 50, ...params } });
}

export function saveCourt(courtId) {
  return api(`/users/saved-courts/${courtId}`, { method: 'POST', auth: true });
}

export function unsaveCourt(courtId) {
  return api(`/users/saved-courts/${courtId}`, { method: 'DELETE', auth: true });
}

export function checkSavedStatus(courtId) {
  return api(`/users/saved-courts/${courtId}/status`, { auth: true });
}

export function patchMe(body) {
  return api('/users/me', { method: 'PATCH', auth: true, body });
}

export function listMyReviews(params = {}) {
  return api('/users/profile/reviews', { auth: true, query: { limit: 50, ...params } });
}

export function listNotifications(params = {}) {
  return api('/users/notifications', { auth: true, query: { limit: 50, ...params } });
}

export function markNotificationRead(notificationId) {
  return api(`/users/notifications/${notificationId}/read`, { method: 'POST', auth: true });
}

export function markAllNotificationsRead() {
  return api('/users/notifications/read-all', { method: 'POST', auth: true });
}

export function getNotificationPreferences() {
  return api('/users/notification-preferences', { auth: true });
}

export function updateNotificationPreferences(preferences) {
  return api('/users/notification-preferences', {
    method: 'PATCH',
    auth: true,
    body: { preferences },
  });
}
