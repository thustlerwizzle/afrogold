// Map supplier names to hosted logo URLs (PNG/SVG). Add real logos here when available.
const SUPPLIER_LOGO_MAP: Record<string, string> = {
  'Siemens South Africa': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Siemens_AG_logo.svg',
  'Eskom Renewable Energy': 'https://upload.wikimedia.org/wikipedia/commons/2/23/Eskom_logo.svg',
  'Bombardier Transportation': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Bombardier_logo.svg',
  'Transnet Engineering': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Transnet_Soc_logo.svg',
  'First Solar Inc': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/First_Solar_logo.svg',
  'Lagos State Construction': 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=200&h=200&fit=crop',
  'Microsoft Healthcare': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'Nigerian Medical Association': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop',
  'Bamburi Cement': 'https://images.unsplash.com/photo-1554470330-c805c6e6d72f?w=200&h=200&fit=crop',
  'Safaricom Construction': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Safaricom_logo.svg',
  'Alstom Transport': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Alstom.svg',
  'Egyptian Railways': 'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?w=200&h=200&fit=crop',
  'Vestas Wind Systems': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Vestas_logo.svg',
  'Moroccan Energy Company': 'https://images.unsplash.com/photo-1542626991-8b7b0da0b6f8?w=200&h=200&fit=crop',
  'Honeywell Process Solutions': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Honeywell_logo.svg',
  'Ghana Water Company': 'https://images.unsplash.com/photo-1502303756783-b6b3df1a7135?w=200&h=200&fit=crop',
  'Microsoft Education': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'Ethiopian Ministry of Education': 'https://images.unsplash.com/photo-1537202108838-e7072bad1927?w=200&h=200&fit=crop',
  'Port of Singapore Authority': 'https://upload.wikimedia.org/wikipedia/commons/1/10/PSA_International_logo.svg',
  'Tanzania Ports Authority': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=200&h=200&fit=crop',
  'International Partners Ltd.': 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=200&h=200&fit=crop'
};

const SECTOR_COLOR: Record<string, { start: string; end: string; icon: string }> = {
  technology: { start: '#8B5CF6', end: '#0EA5E9', icon: '⌁' },
  construction: { start: '#22C55E', end: '#0EA5E9', icon: '▲' },
  materials: { start: '#F59E0B', end: '#EF4444', icon: '■' },
  consulting: { start: '#60A5FA', end: '#A78BFA', icon: '◆' },
  healthcare: { start: '#F472B6', end: '#60A5FA', icon: '✚' },
  water: { start: '#0EA5E9', end: '#22D3EE', icon: '💧' },
  transport: { start: '#34D399', end: '#60A5FA', icon: '➤' },
  energy: { start: '#F59E0B', end: '#22C55E', icon: '⚡' },
  default: { start: '#8B5CF6', end: '#0EA5E9', icon: '◆' }
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const ini = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('');
  return ini || name.slice(0, 2).toUpperCase();
}

export function generateSupplierLogoSvg(name: string, sector: string = 'default'): string {
  const palette = SECTOR_COLOR[sector as keyof typeof SECTOR_COLOR] || SECTOR_COLOR.default;
  const i = initials(name);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="88" height="88" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.start}"/>
      <stop offset="100%" stop-color="${palette.end}"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect rx="20" ry="20" width="88" height="88" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)"/>
  <circle cx="44" cy="44" r="34" fill="none" stroke="url(#grad)" stroke-width="3" filter="url(#glow)"/>
  <text x="44" y="50" text-anchor="middle" font-family="Segoe UI, Roboto, Arial" font-size="28" font-weight="700" fill="white">${i}</text>
  <text x="76" y="16" text-anchor="end" font-size="12" fill="url(#grad)">${palette.icon}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getSupplierLogoUrl(name: string, sector?: string): string {
  const key = Object.keys(SUPPLIER_LOGO_MAP).find(k => k.toLowerCase() === name.toLowerCase());
  if (key) return SUPPLIER_LOGO_MAP[key];
  const cacheKey = `supplier_logo_${name}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {}
  const dataUrl = generateSupplierLogoSvg(name, (sector || 'default').toLowerCase());
  try { localStorage.setItem(cacheKey, dataUrl); } catch {}
  return dataUrl;
}


