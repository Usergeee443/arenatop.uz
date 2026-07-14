export function formatPrice(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return `${Number(amount).toLocaleString('uz-UZ')} so‘m`;
}

export function formatTime(t) {
  if (!t) return '';
  return String(t).slice(0, 5);
}

export function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDaysISO(baseISO, days) {
  const d = new Date(`${baseISO}T12:00:00`);
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDateUz(iso) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('uz-UZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function maskCard(number) {
  const digits = String(number || '').replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  return `•••• ${digits.slice(-4)}`;
}

export function courtImage(court) {
  return (
    court?.cover_image_url ||
    court?.images?.[0]?.image_url ||
    '/assets/hero-mockup.png'
  );
}
