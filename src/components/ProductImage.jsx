import { useState } from 'react';
import {
  Headphones, Plug, Cable, Smartphone, BatteryCharging, Car, Watch, Shield, Package,
} from 'lucide-react';
import { hex, list, resolveProductImage } from '../api';

export function PhoneArt({ color = '#9ca3af', view = 'back' }) {
  const id = `g${color.replace('#', '')}${view}`;
  return (
    <svg viewBox="0 0 200 400" className="phone-art" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
      </defs>
      <rect x="28" y="8" width="144" height="384" rx="30" fill={view === 'front' ? '#111' : color} />
      {view === 'back' ? (
        <>
          <rect x="28" y="8" width="144" height="384" rx="30" fill={`url(#${id})`} />
          <rect x="40" y="22" width="78" height="86" rx="20" fill="#000" opacity=".18" />
          <circle cx="62" cy="48" r="15" fill="#0b0b0c" /><circle cx="62" cy="48" r="7" fill="#2b2f3a" />
          <circle cx="98" cy="48" r="15" fill="#0b0b0c" /><circle cx="98" cy="48" r="7" fill="#2b2f3a" />
          <circle cx="80" cy="86" r="15" fill="#0b0b0c" /><circle cx="80" cy="86" r="7" fill="#2b2f3a" />
        </>
      ) : (
        <>
          <rect x="38" y="18" width="124" height="364" rx="22" fill={color} opacity=".85" />
          <rect x="38" y="18" width="124" height="364" rx="22" fill={`url(#${id})`} />
          <rect x="82" y="28" width="36" height="11" rx="5.5" fill="#000" />
        </>
      )}
    </svg>
  );
}

const ICONS = [
  [/airpods|casque|écouteur/i, Headphones], [/chargeur/i, Plug], [/câble|cable/i, Cable],
  [/coque/i, Smartphone], [/power|batterie/i, BatteryCharging], [/voiture|support/i, Car],
  [/montre/i, Watch], [/protection|verre/i, Shield],
];
export default function ProductImage({ product, color, view = 'back' }) {
  const [useFallback, setUseFallback] = useState(false);
  const resolved = resolveProductImage(product);
  const src = (!useFallback && product?.image_url && product.image_url.trim()) ? product.image_url : resolved;

  return (
    <img
      src={src}
      alt={product?.name || 'Produit'}
      className="product-img"
      onError={() => {
        if (!useFallback) setUseFallback(true);
      }}
      loading="lazy"
    />
  );
}
