import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import Stepper from '../components/Stepper';
import { api, money } from '../api';
import { useStore } from '../context/Store';

export function Summary({ children }) {
  const { subtotal, discount, total, promo } = useStore();
  return (
    <aside className="summary">
      <h3>Résumé</h3>
      <div className="row"><span>Sous-total</span><b>{money(subtotal)}</b></div>
      {promo && <div className="row ok"><span>Code {promo.code} (-{promo.percent}%)</span><b>-{money(discount)}</b></div>}
      <div className="row"><span>Livraison</span><b className="ok">Gratuit</b></div>
      <div className="row total"><span>Total</span><b>{money(total)}</b></div>
      {children}
    </aside>
  );
}

export default function CartPage() {
  const { cart, setQty, removeItem, promo, setPromo, notify } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    setBusy(true);
    try {
      const p = await api('/promo/validate', { method: 'POST', body: { code } });
      setPromo(p);
      notify(`Code ${p.code} appliqué : -${p.percent}%`);
      setCode('');
    } catch (e) { notify(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="page narrow">
      <Stepper current={1} />
      <h1 className="h-left">Mon panier ({cart.reduce((a, i) => a + i.qty, 0)})</h1>

      {cart.length === 0 ? (
        <div className="empty">
          <p>Votre panier est vide.</p>
          <Link to="/smartphones" className="btn btn-dark">Découvrir nos produits</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div>
            <div className="cart-list">
              {cart.map((i) => (
                <div className="cart-row" key={i.key}>
                  <Link to={`/produit/${i.product.id}`} className="cart-thumb"><ProductImage product={i.product} color={i.color} /></Link>
                  <div className="cart-info">
                    <b>{i.product.name}</b>
                    <small>{[i.storage, i.color].filter(Boolean).join(' - ')}</small>
                  </div>
                  <div className="qty sm">
                    <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="Moins"><Minus size={13} /></button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="Plus"><Plus size={13} /></button>
                  </div>
                  <b className="cart-price">{money(i.product.price * i.qty)}</b>
                  <button className="icon-btn danger" onClick={() => removeItem(i.key)} aria-label="Supprimer"><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
            <Link to="/smartphones" className="btn btn-pill"><ArrowLeft size={15} /> Continuer mes achats</Link>
          </div>

          <Summary>
            <button className="btn btn-dark full" onClick={() => navigate('/commande')}>
              Passer la commande <ArrowRight size={16} />
            </button>
            <div className="promo">
              <label htmlFor="promo">Code promo</label>
              <div>
                <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Entrer votre code"
                  onKeyDown={(e) => e.key === 'Enter' && apply()} />
                <button className="btn btn-light" onClick={apply} disabled={busy}>Appliquer</button>
              </div>
              {promo
                ? <small className="ok">Code {promo.code} actif · <button className="link" onClick={() => setPromo(null)}>retirer</button></small>
                : <small className="muted">Essayez PROMO10</small>}
            </div>
          </Summary>
        </div>
      )}
    </div>
  );
}
