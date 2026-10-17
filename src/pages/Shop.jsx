import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { hex, list, money } from '../api';
import { useStore } from '../context/Store';

const csv = (v) => (v ? v.split(',').filter(Boolean) : []);

export default function Shop({ mode = 'smartphones' }) {
  const { products, loading, error, loadProducts } = useStore();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get('q') || '';
  const brands = csv(params.get('brand'));
  const colors = csv(params.get('color'));
  const mems = csv(params.get('mem'));
  const inStock = params.get('stock') === '1';
  const sort = params.get('sort') || 'popular';

  const base = useMemo(
    () => products.filter((p) => p.category === 'Smartphones' && (mode !== 'promotions' || p.old_price)),
    [products, mode]
  );
  const promoBase = useMemo(
    () => (mode === 'promotions' ? products.filter((p) => p.old_price) : base),
    [products, base, mode]
  );
  const maxPrice = Math.max(20000, ...promoBase.map((p) => Number(p.price)));
  const price = Number(params.get('price')) || maxPrice;

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value === null || value === false || (Array.isArray(value) && !value.length)) next.delete(key);
    else next.set(key, Array.isArray(value) ? value.join(',') : value);
    setParams(next, { replace: true });
  };
  const toggle = (key, current, v) =>
    set(key, current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);

  const items = mode === 'promotions' ? promoBase : base;
  const brandCounts = useMemo(() => {
    const m = {};
    items.forEach((p) => { m[p.brand] = (m[p.brand] || 0) + 1; });
    return Object.entries(m);
  }, [items]);
  const colorList = useMemo(() => [...new Set(items.flatMap((p) => list(p.colors)))], [items]);
  const memList = useMemo(() => [...new Set(items.flatMap((p) => list(p.storages)))], [items]);
  const memCount = (m) => items.filter((p) => list(p.storages).includes(m)).length;

  const filtered = useMemo(() => {
    let r = items.filter((p) => {
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (colors.length && !colors.some((c) => list(p.colors).includes(c))) return false;
      if (mems.length && !mems.some((m) => list(p.storages).includes(m))) return false;
      if (inStock && p.stock <= 0) return false;
      return Number(p.price) <= price;
    });
    if (sort === 'asc') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'desc') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating);
    else r = [...r].sort((a, b) => b.reviews_count - a.reviews_count);
    return r;
  }, [items, q, brands, colors, mems, inStock, price, sort]);

  return (
    <div className="page">
      <div className="searchbar">
        <Search size={16} />
        <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Rechercher un téléphone, une marque…" />
      </div>

      <div className="shop">
        <button className="btn btn-light filters-toggle" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={16} /> Filtres
        </button>

        <aside className={`filters ${showFilters ? 'open' : ''}`}>
          <div className="filters-head">
            <h3>Filtres</h3>
            <button className="link" onClick={() => setParams({}, { replace: true })}>Tout effacer</button>
          </div>

          <div className="f-group">
            <h4>Marque</h4>
            {brandCounts.map(([b, n]) => (
              <label key={b} className="check">
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggle('brand', brands, b)} />
                {b} ({n})
              </label>
            ))}
          </div>

          <div className="f-group">
            <h4>Prix</h4>
            <input type="range" min="0" max={maxPrice} step="100" value={price}
              onChange={(e) => set('price', Number(e.target.value) >= maxPrice ? '' : e.target.value)} />
            <div className="range-labels"><span>0 DH</span><span>{money(price)}</span></div>
          </div>

          <div className="f-group">
            <h4>Stock</h4>
            <label className="check">
              <input type="checkbox" checked={inStock} onChange={(e) => set('stock', e.target.checked ? '1' : '')} />
              En stock uniquement
            </label>
          </div>

          <div className="f-group">
            <h4>Couleur</h4>
            <div className="swatches">
              {colorList.map((c) => (
                <button key={c} title={c} aria-label={c} className={`swatch ${colors.includes(c) ? 'on' : ''}`}
                  style={{ background: hex(c) }} onClick={() => toggle('color', colors, c)} />
              ))}
            </div>
          </div>

          <div className="f-group">
            <h4>Mémoire</h4>
            {memList.map((m) => (
              <label key={m} className="check">
                <input type="checkbox" checked={mems.includes(m)} onChange={() => toggle('mem', mems, m)} />
                {m} ({memCount(m)})
              </label>
            ))}
          </div>
        </aside>

        <section className="shop-main">
          <div className="shop-head">
            <h1>{mode === 'promotions' ? 'Promotions' : 'Smartphones'} <small>{filtered.length} produits</small></h1>
            <label className="sort">Trier par :
              <select value={sort} onChange={(e) => set('sort', e.target.value === 'popular' ? '' : e.target.value)}>
                <option value="popular">Populaire</option>
                <option value="asc">Prix croissant</option>
                <option value="desc">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </label>
          </div>
          {error && (
            <div className="notice error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span>{error}</span>
              <button className="btn btn-light" style={{ padding: '.3rem .8rem', fontSize: '.8rem' }} onClick={loadProducts}>Réessayer</button>
            </div>
          )}
          {loading ? <p className="muted">Chargement…</p> : filtered.length === 0 ? (
            <p className="empty">Aucun produit ne correspond à votre recherche.</p>
          ) : (
            <div className="grid grid-3">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </section>
      </div>
    </div>
  );
}
