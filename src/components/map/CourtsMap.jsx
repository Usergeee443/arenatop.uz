import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { courtImage, formatPrice } from '../../utils/format';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [41.3111, 69.2797];
const DEFAULT_ZOOM = 11;

function pinIcon(active) {
  return L.divIcon({
    className: `map-pin${active ? ' is-active' : ''}`,
    html: '<span class="map-pin__dot"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
  });
}

export default function CourtsMap({ courts, selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const onSelectRef = useRef(onSelect);
  const navigate = useNavigate();
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const el = containerRef.current;
    const map = L.map(el, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    mapRef.current = map;

    const onResize = () => map.invalidateSize();
    const onPopupClick = (e) => {
      const link = e.target.closest('a.map-popup__link');
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) navigate(href);
    };

    window.addEventListener('resize', onResize);
    el.addEventListener('click', onPopupClick);
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener('resize', onResize);
      el.removeEventListener('click', onPopupClick);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [navigate]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextIds = new Set(courts.map((c) => c.id));

    markersRef.current.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    const bounds = [];

    courts.forEach((court) => {
      const lat = Number(court.latitude);
      const lng = Number(court.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      bounds.push([lat, lng]);

      let marker = markersRef.current.get(court.id);
      if (!marker) {
        marker = L.marker([lat, lng], { icon: pinIcon(false) });
        marker.on('click', () => onSelectRef.current?.(court));
        marker.addTo(map);
        markersRef.current.set(court.id, marker);
      } else {
        marker.setLatLng([lat, lng]);
      }

      const img = courtImage(court);
      const price = formatPrice(court.price_per_hour);
      marker.bindPopup(
        `<div class="map-popup">
          ${img ? `<img src="${img}" alt="" class="map-popup__img" />` : ''}
          <strong class="map-popup__name">${escapeHtml(court.name || 'Maydon')}</strong>
          <span class="map-popup__loc">${escapeHtml(court.location_name || '')}</span>
          <span class="map-popup__price">${escapeHtml(price)} / soat</span>
          <a class="map-popup__link" href="/maydon/${court.id}">Ko‘rish</a>
        </div>`,
        { maxWidth: 240, className: 'map-popup-wrap' }
      );
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 14);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [courts]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      marker.setIcon(pinIcon(id === selectedId));
      if (id === selectedId) {
        marker.openPopup();
        const { lat, lng } = marker.getLatLng();
        mapRef.current?.panTo([lat, lng], { animate: true });
      }
    });
  }, [selectedId]);

  return <div ref={containerRef} className="courts-map" role="presentation" />;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
