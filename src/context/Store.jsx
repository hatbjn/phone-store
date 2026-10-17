import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const read = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  const search = window.location.search;
  if (search.includes('demo=client')) {
    localStorage.setItem('token', 'demo-client-token');
    return { id: 5, name: 'Amine Tazi', email: 'amine.tazi@gmail.com', role: 'user', phone: '+212 661 458920' };
  }
  if (search.includes('demo=admin')) {
    localStorage.setItem('token', 'demo-admin-token');
    return { id: 4, name: 'Charaf-Eddine Mlili', email: 'admin@expressor.ma', role: 'admin', phone: '+212 660 123456' };
  }
  const token = localStorage.getItem('token');
  if (token === 'demo-client-token') {
    return { id: 5, name: 'Amine Tazi', email: 'amine.tazi@gmail.com', role: 'user', phone: '+212 661 458920' };
  }
  if (token === 'demo-admin-token') {
    return { id: 4, name: 'Charaf-Eddine Mlili', email: 'admin@expressor.ma', role: 'admin', phone: '+212 660 123456' };
  }
  return null;
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(() => read('cart', []));
  const [favorites, setFavorites] = useState(() => read('favorites', []));
  const [promo, setPromo] = useState(() => read('promo', null));
  const [user, setUser] = useState(() => getInitialUser());
  const [authReady, setAuthReady] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (window.location.search.includes('demo=')) return true;
    const token = localStorage.getItem('token');
    if (token === 'demo-admin-token' || token === 'demo-client-token') return true;
    return !token;
  });
  const [toast, setToast] = useState('');

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => setToast(''), 2600);
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setError('');
      setProducts(await api('/products'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('demo=client')) {
      localStorage.setItem('token', 'demo-client-token');
      setUser({ id: 5, name: 'Amine Tazi', email: 'amine.tazi@gmail.com', role: 'user', phone: '+212 661 458920' });
      setAuthReady(true);
      return;
    }
    if (typeof window !== 'undefined' && window.location.search.includes('demo=admin')) {
      localStorage.setItem('token', 'demo-admin-token');
      setUser({ id: 4, name: 'Charaf-Eddine Mlili', email: 'admin@expressor.ma', role: 'admin', phone: '+212 660 123456' });
      setAuthReady(true);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    if (token === 'demo-admin-token') {
      setUser({ id: 4, name: 'Charaf-Eddine Mlili', email: 'admin@expressor.ma', role: 'admin', phone: '+212 660 123456' });
      setAuthReady(true);
      return;
    }
    if (token === 'demo-client-token') {
      setUser({ id: 5, name: 'Amine Tazi', email: 'amine.tazi@gmail.com', role: 'user', phone: '+212 661 458920' });
      setAuthReady(true);
      return;
    }
    api('/auth/me')
      .then((u) => {
        setUser(u);
        api('/favorites').then((dbFavs) => {
          if (Array.isArray(dbFavs) && dbFavs.length) {
            setFavorites((prev) => Array.from(new Set([...prev, ...dbFavs])));
          }
        }).catch(() => {});
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setAuthReady(true));
  }, []);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('promo', JSON.stringify(promo)); }, [promo]);

  const addToCart = (product, { color, storage, qty = 1 } = {}) => {
    const key = `${product.id}|${color || ''}|${storage || ''}`;
    const existing = cart.find((i) => i.key === key);
    const inCart = existing ? existing.qty : 0;
    if (inCart + qty > product.stock) {
      notify(`Stock limité : ${product.stock} disponible(s)`);
      return false;
    }
    setCart((prev) =>
      existing
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { key, product, color, storage, qty }]
    );
    notify(`${product.name} ajouté au panier`);
    return true;
  };

  const setQty = (key, qty) =>
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.min(Math.max(qty, 1), i.product.stock || 99) } : i))
    );
  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));
  const clearCart = () => { setCart([]); setPromo(null); };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const has = prev.includes(id);
      notify(has ? 'Retiré des favoris' : 'Ajouté aux favoris');
      const updated = has ? prev.filter((x) => x !== id) : [...prev, id];
      if (user && !String(localStorage.getItem('token') || '').startsWith('demo-')) {
        api('/favorites/toggle', { method: 'POST', body: { product_id: id } }).catch(() => {});
      }
      return updated;
    });
  };

  const login = (token, u) => { localStorage.setItem('token', token); setUser(u); };
  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch { /* session déjà expirée */ }
    localStorage.removeItem('token');
    setUser(null);
  };

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const subtotal = cart.reduce((a, i) => a + Number(i.product.price) * i.qty, 0);
  const discount = promo ? Math.round(subtotal * promo.percent) / 100 : 0;
  const total = subtotal - discount;

  const value = useMemo(
    () => ({
      products, loading, error, loadProducts, cart, cartCount, subtotal, discount, total, promo, setPromo,
      addToCart, setQty, removeItem, clearCart, favorites, toggleFavorite, user, setUser, authReady, login, logout, notify,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, loading, error, cart, favorites, promo, user, authReady]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </Ctx.Provider>
  );
}
