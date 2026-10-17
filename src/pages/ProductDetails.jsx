import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star, Heart, Share2, Truck, ShieldCheck, RotateCcw, ChevronLeft, ChevronRight, Minus, Plus,
} from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { api, hex, list, money } from '../api';
import { useStore } from '../context/Store';

const TABS = ['Description', 'Caractéristiques', 'Avis', 'Livraison'];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, addToCart, favorites, toggleFavorite, notify, user, loadProducts } = useStore();
  const product = products.find((p) => String(p.id) === id);

  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState('Description');
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ author: '', rating: 5, comment: '' });

  useEffect(() => {
    if (!product) return;
    setColor(list(product.colors)[0] || '');
    setStorage(list(product.storages)[1] || list(product.storages)[0] || '');
    setQty(1);
    setShot(0);
    api(`/products/${product.id}/reviews`).then(setReviews).catch(() => {});
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="page"><p className="muted">Chargement…</p></div>;
  if (!product) return (
    <div className="page"><p className="empty">Produit introuvable. <Link className="link" to="/smartphones">Retour au catalogue</Link></p></div>
  );

  const colors = list(product.colors);
  const storages = list(product.storages);
  const fav = favorites.includes(product.id);
  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
  const views = ['back', 'front', 'back', 'front'];
  const out = product.stock <= 0;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Lien copié dans le presse-papiers');
    } catch { notify('Copie impossible'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api(`/products/${product.id}/reviews`, { method: 'POST', body: form });
      setForm({ author: '', rating: 5, comment: '' });
      setReviews(await api(`/products/${product.id}/reviews`));
      loadProducts();
      notify('Merci pour votre avis !');
    } catch (err) { notify(err.message); }
  };

  const specs = [
    ['Marque', product.brand], ['Catégorie', product.category],
    ...(storages.length ? [['Stockage', storages.join(' / ')]] : []),
    ...(colors.length ? [['Couleurs', colors.join(', ')]] : []),
    ['Garantie', '1 an'], ['Disponibilité', out ? 'Rupture de stock' : `${product.stock} en stock`],
  ];

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/">Accueil</Link> › <Link to={product.category === 'Accessoires' ? '/accessoires' : '/smartphones'}>
          {product.category === 'Accessoires' ? 'Accessoires' : 'Smartphones'}</Link> › {product.brand} › <b>{product.name}</b>
      </nav>

      <div className="pd">
        <div className="gallery">
          <div className="thumbs">
            {views.map((v, i) => (
              <button key={i} className={`thumb ${shot === i ? 'on' : ''}`} onClick={() => setShot(i)} aria-label={`Vue ${i + 1}`}>
                <ProductImage product={product} color={color} view={v} />
              </button>
            ))}
          </div>
          <div className="stage">
            <button className="nav-arrow l" onClick={() => setShot((shot + 3) % 4)} aria-label="Précédent"><ChevronLeft size={18} /></button>
            <ProductImage product={product} color={color} view={views[shot]} />
            <button className="nav-arrow r" onClick={() => setShot((shot + 1) % 4)} aria-label="Suivant"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="info">
          <div className="info-top">
            <div className="tags">
              <span className="tag blue">Nouveau</span>
              {discount > 0 && <span className="tag red">-{discount}%</span>}
            </div>
            <div className="info-icons">
              <button className="icon-btn" onClick={share} aria-label="Partager"><Share2 size={18} /></button>
              <button className={`icon-btn ${fav ? 'fav-on' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label="Favori">
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <h1>{product.name}</h1>
          <div className="stars big"><Star size={15} fill="currentColor" /> {Number(product.rating).toFixed(1)}
            <span>({product.reviews_count} avis)</span></div>
          <div className="price-row">
            <span className="price">{money(product.price)}</span>
            {product.old_price && <s>{money(product.old_price)}</s>}
            {discount > 0 && <span className="tag red">-{discount}%</span>}
          </div>
          <p className="muted">{product.description}</p>

          {colors.length > 0 && (
            <div className="opt">
              <b>Couleur : <span className="muted">{color}</span></b>
              <div className="swatches lg">
                {colors.map((c) => (
                  <button key={c} title={c} aria-label={c} className={`swatch ${c === color ? 'on' : ''}`}
                    style={{ background: hex(c) }} onClick={() => setColor(c)} />
                ))}
              </div>
            </div>
          )}

          {storages.length > 0 && (
            <div className="opt">
              <b>Stockage :</b>
              <div className="chips">
                {storages.map((s) => (
                  <button key={s} className={`chip ${s === storage ? 'on' : ''}`} onClick={() => setStorage(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="buy">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Moins"><Minus size={14} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} aria-label="Plus"><Plus size={14} /></button>
            </div>
            <button className="btn btn-dark grow" disabled={out}
              onClick={() => addToCart(product, { color, storage, qty })}>
              {out ? 'Rupture de stock' : 'Ajouter au panier'}
            </button>
          </div>
          <button className="btn btn-light full" disabled={out}
            onClick={() => addToCart(product, { color, storage, qty }) && navigate('/panier')}>
            Acheter maintenant
          </button>

          <div className="assure">
            <div><Truck size={18} /><div><b>Livraison rapide</b><small>2-3 jours</small></div></div>
            <div><ShieldCheck size={18} /><div><b>Garantie officielle</b><small>1 an</small></div></div>
            <div><RotateCcw size={18} /><div><b>Retour facile</b><small>14 jours</small></div></div>
          </div>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t === 'Avis' ? `Avis (${product.reviews_count})` : t}
          </button>
        ))}
      </div>
      <div className="tab-body">
        {tab === 'Description' && <p>{product.description}</p>}
        {tab === 'Caractéristiques' && (
          <table className="specs"><tbody>{specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
        )}
        {tab === 'Avis' && (
          <div className="reviews">
            <form className="review-form" onSubmit={submitReview}>
              <h4>Donner mon avis</h4>
              {!user && (
                <input placeholder="Votre nom" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              )}
              <div className="rate">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} étoiles`}
                    className={n <= form.rating ? 'on' : ''}><Star size={20} fill="currentColor" /></button>
                ))}
              </div>
              <textarea rows="3" required placeholder="Votre commentaire" value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              <button className="btn btn-dark" type="submit">Publier</button>
            </form>
            {reviews.length === 0 ? <p className="muted">Aucun avis pour le moment. Soyez le premier !</p> : reviews.map((r) => (
              <div className="review" key={r.id}>
                <b>{r.author}</b>
                <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'Livraison' && (
          <ul className="bullets">
            <li>Livraison gratuite partout au Maroc en 2 à 3 jours ouvrés.</li>
            <li>Paiement à la livraison disponible.</li>
            <li>Retour gratuit sous 14 jours après réception.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
