import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/Store';

export default function Accessories() {
  const { products, loading, error, loadProducts } = useStore();
  const items = products.filter((p) => p.category === 'Accessoires');
  return (
    <div className="page">
      <div className="section-head" style={{ marginBottom: '1.35rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.1rem, 3.2vw, 2.75rem)', fontWeight: 700, marginBottom: '.35rem', color: '#ffffff' }}>Accessoires</h1>
          <p className="muted" style={{ fontSize: '1.18rem', margin: 0 }}>Tout ce qu'il faut pour votre smartphone &amp; vos appareils mobiles</p>
        </div>
        <span style={{ fontSize: '1.12rem', fontWeight: 600, color: 'var(--primary)', background: 'rgba(153, 227, 158, 0.1)', padding: '.45rem 1rem', borderRadius: '99px', border: '1px solid rgba(153, 227, 158, 0.25)' }}>
          {items.length} articles disponibles
        </span>
      </div>
      {error && (
        <div className="notice error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <span>{error}</span>
          <button className="btn btn-light" style={{ padding: '.3rem .8rem', fontSize: '.85rem' }} onClick={loadProducts}>Réessayer</button>
        </div>
      )}
      {loading ? <p className="muted">Chargement…</p> : (
        <div className="grid grid-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
