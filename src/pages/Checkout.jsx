import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import Stepper from '../components/Stepper';
import ProductImage from '../components/ProductImage';
import { api, money } from '../api';
import { useStore } from '../context/Store';

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan'];
const LABELS = ['Livraison', 'Paiement', 'Confirmation'];

function Recap({ children }) {
  const { cart, subtotal, discount, total, promo } = useStore();
  return (
    <aside className="summary">
      <h3>Récapitulatif de la commande</h3>
      {cart.map((i) => (
        <div className="recap-item" key={i.key}>
          <div className="mini"><ProductImage product={i.product} color={i.color} /></div>
          <div><b>{i.product.name}</b><small>{[i.storage, i.color].filter(Boolean).join(' - ')}</small></div>
          <span>x{i.qty}</span>
          <b>{money(i.product.price * i.qty)}</b>
        </div>
      ))}
      <div className="row"><span>Sous-total</span><b>{money(subtotal)}</b></div>
      {promo && <div className="row ok"><span>Code {promo.code}</span><b>-{money(discount)}</b></div>}
      <div className="row"><span>Livraison</span><b className="ok">Gratuit</b></div>
      <div className="row total"><span>Total</span><b>{money(total)}</b></div>
      {children}
    </aside>
  );
}

export default function Checkout() {
  const { cart, promo, clearCart, user, notify } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState([]);
  const [ship, setShip] = useState({ full_name: '', phone: '', address: '', city: '', postal_code: '' });
  const [billing, setBilling] = useState(false);
  const [saveAddr, setSaveAddr] = useState(false);
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });

  useEffect(() => {
    if (user) {
      setShip((s) => ({ ...s, full_name: s.full_name || user.name, phone: s.phone || user.phone || '' }));
      api('/addresses').then(setSaved).catch(() => {});
    }
  }, [user]);

  if (cart.length === 0 && !done) return <Navigate to="/panier" replace />;

  const upd = (k) => (e) => setShip({ ...ship, [k]: e.target.value });

  const validateShip = () => {
    const e = {};
    if (!ship.full_name.trim()) e.full_name = 'Nom requis';
    if (!/^[+\d][\d\s.-]{7,}$/.test(ship.phone.trim())) e.phone = 'Téléphone invalide';
    if (!ship.address.trim()) e.address = 'Adresse requise';
    if (!ship.city) e.city = 'Ville requise';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateCard = () => {
    const e = {};
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) e.number = 'Numéro à 16 chiffres requis';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'Format MM/AA';
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = 'CVV invalide';
      if (!card.holder.trim()) e.holder = 'Nom requis';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const pay = async () => {
    if (!validateCard()) return;
    setBusy(true);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: {
          items: cart.map((i) => ({ product_id: i.product.id, quantity: i.qty, color: i.color, storage: i.storage })),
          shipping: ship,
          payment_method: method,
          promo_code: promo?.code,
        },
      });
      if (saveAddr && user) {
        await api('/addresses', { method: 'POST', body: { ...ship, label: 'Livraison' } }).catch(() => {});
      }
      setDone(order);
      clearCart();
      setStep(3);
    } catch (e) { notify(e.message); } finally { setBusy(false); }
  };

  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const Err = ({ k }) => (errors[k] ? <small className="err">{errors[k]}</small> : null);

  if (step === 3 && done) {
    return (
      <div className="page narrow">
        <Stepper current={4} labels={LABELS} />
        <div className="confirm">
          <CheckCircle2 size={60} />
          <h1>Commande confirmée !</h1>
          <p>Merci pour votre achat. Votre commande <b>#CMD{String(done.id).padStart(3, '0')}</b> d'un montant de <b>{money(done.total)}</b> est en cours de préparation.</p>
          <div className="btn-row">
            <Link to={user ? '/compte/commandes' : '/smartphones'} className="btn btn-dark">
              {user ? 'Suivre mes commandes' : 'Continuer mes achats'}
            </Link>
            <Link to="/" className="btn btn-light">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <Stepper current={step} labels={LABELS} />
      <div className="cart-grid">
        {step === 1 ? (
          <div className="form-card">
            <h2>Informations de livraison</h2>
            {!user && (
              <p className="notice">Vous avez un compte ? <Link className="link" to="/connexion?redirect=/commande">Connectez-vous</Link> pour suivre votre commande.</p>
            )}
            {saved.length > 0 && (
              <div className="field">
                <label>Adresses enregistrées</label>
                <select defaultValue="" onChange={(e) => {
                  const a = saved.find((x) => String(x.id) === e.target.value);
                  if (a) setShip({ full_name: a.full_name, phone: a.phone || '', address: a.address, city: a.city, postal_code: a.postal_code || '' });
                }}>
                  <option value="">Choisir une adresse…</option>
                  {saved.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.address}, {a.city}</option>)}
                </select>
              </div>
            )}
            <div className="field"><label>Nom complet*</label><input value={ship.full_name} onChange={upd('full_name')} placeholder="Votre nom complet" /><Err k="full_name" /></div>
            <div className="field"><label>Téléphone*</label><input value={ship.phone} onChange={upd('phone')} placeholder="06 12 34 56 78" inputMode="tel" /><Err k="phone" /></div>
            <div className="field"><label>Adresse*</label><input value={ship.address} onChange={upd('address')} placeholder="Votre adresse complète" /><Err k="address" /></div>
            <div className="two">
              <div className="field"><label>Ville*</label>
                <select value={ship.city} onChange={upd('city')}>
                  <option value="">Choisir votre ville</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select><Err k="city" /></div>
              <div className="field"><label>Code postal</label><input value={ship.postal_code} onChange={upd('postal_code')} placeholder="Code postal (optionnel)" /></div>
            </div>
            <label className="check"><input type="checkbox" checked={billing} onChange={(e) => setBilling(e.target.checked)} /> Utiliser une autre adresse de facturation</label>
            {billing && <p className="notice">La facture sera émise à l'adresse de livraison ci-dessus (adresse distincte non gérée pour l'instant).</p>}
          </div>
        ) : (
          <div className="form-card">
            <h2>Méthode de paiement</h2>
            <div className="pay-options">
              <label className={`pay ${method === 'card' ? 'on' : ''}`}>
                <input type="radio" name="m" checked={method === 'card'} onChange={() => setMethod('card')} /> Carte bancaire
                <span className="brands"><i className="visa">VISA</i><i className="mc"><u /><u /></i></span>
              </label>
              <label className={`pay ${method === 'transfer' ? 'on' : ''}`}>
                <input type="radio" name="m" checked={method === 'transfer'} onChange={() => setMethod('transfer')} /> Virement bancaire
              </label>
              <label className={`pay ${method === 'cod' ? 'on' : ''}`}>
                <input type="radio" name="m" checked={method === 'cod'} onChange={() => setMethod('cod')} /> Paiement à la livraison
              </label>
            </div>
            {method === 'card' && (
              <>
                <div className="field"><label>Numéro de carte</label>
                  <input value={card.number} onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })} placeholder="1234 5678 9012 3456" inputMode="numeric" /><Err k="number" /></div>
                <div className="two">
                  <div className="field"><label>Date d'expiration</label>
                    <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: fmtExp(e.target.value) })} placeholder="MM/AA" inputMode="numeric" /><Err k="expiry" /></div>
                  <div className="field"><label>Code CVV</label>
                    <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" inputMode="numeric" /><Err k="cvv" /></div>
                </div>
                <div className="field"><label>Nom sur la carte</label>
                  <input value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} placeholder="Nom sur la carte" /><Err k="holder" /></div>
              </>
            )}
            {method === 'transfer' && <p className="notice">Les coordonnées bancaires vous seront envoyées par téléphone après validation de la commande.</p>}
            {method === 'cod' && <p className="notice">Réglez en espèces à la réception de votre colis.</p>}
            {user && (
              <label className="check"><input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} /> Enregistrer cette adresse pour mes prochains achats</label>
            )}
            <button className="link" onClick={() => setStep(1)}>← Modifier la livraison</button>
          </div>
        )}

        <Recap>
          {step === 1 ? (
            <button className="btn btn-dark full" onClick={() => validateShip() && setStep(2)}>Continuer vers le paiement →</button>
          ) : (
            <>
              <button className="btn btn-dark full" onClick={pay} disabled={busy}>
                {busy ? 'Traitement…' : 'Payer maintenant'} <Lock size={14} />
              </button>
              <p className="secure"><Lock size={13} /> Paiement 100% sécurisé</p>
            </>
          )}
        </Recap>
      </div>
    </div>
  );
}
