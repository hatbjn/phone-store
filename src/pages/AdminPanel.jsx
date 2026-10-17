import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import ImageDropzone from '../components/ImageDropzone';
import { api, money } from '../api';
import { useStore } from '../context/Store';

const empty = {
  name: '', brand: '', category: 'Smartphones', price: '', old_price: '', stock: '',
  colors: '', storages: '', image_url: '', description: '',
};

export default function AdminPanel() {
  const { products, loadProducts, notify, user } = useStore();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/products', { method: 'POST', body: f });
      setF(empty);
      await loadProducts();
      notify('Produit enregistré dans MySQL');
    } catch (err) { notify(err.message); } finally { setBusy(false); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Supprimer « ${p.name} » ?`)) return;
    await api(`/products/${p.id}`, { method: 'DELETE' });
    await loadProducts();
    notify('Produit supprimé');
  };

  return (
    <div className="page narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <h1>Administration</h1>
        {user?.role === 'admin' ? (
          <span className="pill green">Connecté en Admin ({user.email})</span>
        ) : (
          <span className="pill orange">Mode public · Connectez-vous avec admin@expressor.ma</span>
        )}
      </div>
      <form className="form-card" onSubmit={submit}>
        <h3>Ajouter un produit</h3>
        <div className="two">
          <div className="field"><label>Nom*</label><input required value={f.name} onChange={upd('name')} /></div>
          <div className="field"><label>Marque</label><input value={f.brand} onChange={upd('brand')} /></div>
        </div>
        <div className="two">
          <div className="field"><label>Catégorie</label>
            <select value={f.category} onChange={upd('category')}><option>Smartphones</option><option>Accessoires</option></select></div>
          <div className="field"><label>Stock</label><input type="number" min="0" value={f.stock} onChange={upd('stock')} /></div>
        </div>
        <div className="two">
          <div className="field"><label>Prix (DH)*</label><input required type="number" min="0" step="0.01" value={f.price} onChange={upd('price')} /></div>
          <div className="field"><label>Ancien prix (promo)</label><input type="number" min="0" step="0.01" value={f.old_price} onChange={upd('old_price')} /></div>
        </div>
        <div className="two">
          <div className="field"><label>Couleurs (séparées par des virgules)</label><input placeholder="Noir,Bleu,Titane" value={f.colors} onChange={upd('colors')} /></div>
          <div className="field"><label>Stockages</label><input placeholder="128 Go,256 Go" value={f.storages} onChange={upd('storages')} /></div>
        </div>
        <ImageDropzone
          value={f.image_url}
          onChange={(url) => setF({ ...f, image_url: url })}
          label="Image du produit (glissez votre photo ici)"
        />
        <div className="field"><label>Description</label><textarea rows="3" value={f.description} onChange={upd('description')} /></div>
        <button className="btn btn-dark" disabled={busy}>{busy ? 'Enregistrement…' : 'Ajouter le produit'}</button>
      </form>

      <h3 className="h-left">Catalogue ({products.length})</h3>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th></th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><div className="mini"><ProductImage product={p} /></div></td>
                <td data-l="Nom">{p.name}</td><td data-l="Catégorie">{p.category}</td>
                <td data-l="Prix">{money(p.price)}</td><td data-l="Stock">{p.stock}</td>
                <td><button className="icon-btn danger" onClick={() => remove(p)} aria-label="Supprimer"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
