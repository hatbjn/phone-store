import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, MapPin, Heart, User, LogOut, Package, RotateCcw, Trash2, X, Plus, Pencil,
  BarChart3, TrendingUp, Layers, AlertTriangle, CreditCard, RefreshCw, Tag, Users, Eye, CheckCircle,
  Truck, Clock, Lock, Sparkles, ShoppingCart, Percent, Search, LayoutGrid, List,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import ImageDropzone from '../components/ImageDropzone';
import { api, money } from '../api';
import { useStore } from '../context/Store';

const STATUS = {
  delivered: ['Livrée', 'green'],
  shipped: ['Expédiée', 'blue'],
  processing: ['En cours', 'orange'],
  cancelled: ['Annulée', 'red'],
};
const cmd = (id) => `#CMD${String(id).padStart(3, '0')}`;
const fmtDate = (d) => {
  if (!d) return '-';
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? '-' : dt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

function Badge({ status }) {
  const [label, color] = STATUS[status] || [status, 'orange'];
  return <span className={`pill ${color}`}>{label}</span>;
}

function OrdersTable({ orders, limit, onOpen }) {
  const rows = limit ? orders.slice(0, limit) : orders;
  if (!rows.length) {
    return (
      <p className="empty">
        Vous n'avez pas encore passé de commande. <Link className="link" to="/smartphones">Commencer mes achats</Link>
      </p>
    );
  }
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>N° Commande</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id}>
              <td data-l="N°">{cmd(o.id)}</td>
              <td data-l="Date">{fmtDate(o.created_at)}</td>
              <td data-l="Statut"><Badge status={o.status} /></td>
              <td data-l="Total"><b>{money(o.total)}</b></td>
              <td data-l="Détails">
                <button className="link" onClick={() => onOpen(o)}>Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const { user, setUser, authReady, logout, products, loadProducts, favorites, addToCart, notify } = useStore();
  const { tab = '' } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', password: '' });
  const [addr, setAddr] = useState({ label: 'Domicile', full_name: '', phone: '', address: '', city: '', postal_code: '' });

  // Admin States
  const [adminStats, setAdminStats] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [clientFavorites, setClientFavorites] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [adminOrderFilter, setAdminOrderFilter] = useState('all');
  const [favViewMode, setFavViewMode] = useState('clients'); // 'clients' or 'perso'
  const [favSearch, setFavSearch] = useState('');
  const [favDisplayFormat, setFavDisplayFormat] = useState('table'); // 'table' or 'cards'

  // Product Management States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedToDelete, setSelectedToDelete] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', category: 'Smartphones', price: '', old_price: '',
    stock: '10', colors: '', storages: '', image_url: '', description: '',
  });

  const isAdmin = user?.role === 'admin';

  // Load Admin Data
  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingAdminData(true);
    try {
      const [stats, ords, usrs, favs] = await Promise.all([
        api('/admin/stats').catch(() => null),
        api('/admin/orders').catch(() => []),
        api('/admin/users').catch(() => []),
        api('/admin/favorites').catch(() => []),
      ]);
      if (stats) setAdminStats(stats);
      if (Array.isArray(ords)) setAdminOrders(ords);
      if (Array.isArray(usrs)) setAdminUsers(usrs);
      if (Array.isArray(favs)) setClientFavorites(favs);
    } catch {
      // ignore
    } finally {
      setLoadingAdminData(false);
    }
  }, [isAdmin]);

  // Load User Data
  const loadUserData = useCallback(async () => {
    try {
      const [o, a] = await Promise.all([
        api('/orders').catch(() => []),
        api('/addresses').catch(() => []),
      ]);
      setOrders(o);
      setAddresses(a);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '' });
      if (user.role === 'admin') {
        loadAdminData();
        setFavViewMode('clients');
      } else {
        setFavViewMode('perso');
      }
    }
  }, [user, loadUserData, loadAdminData]);

  const favProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter((p) => (favorites || []).includes(p.id));
  }, [products, favorites]);

  const totalFavValue = useMemo(() => {
    return favProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);
  }, [favProducts]);

  // All (client, favorite_product) pairs flattened for immediate direct matching table
  const allClientProductPairs = useMemo(() => {
    const pairs = [];
    (Array.isArray(clientFavorites) ? clientFavorites : []).forEach((cf) => {
      (cf.items || []).forEach((it) => {
        if (it) {
          pairs.push({
            user_id: cf.user_id,
            client_name: cf.user_name || 'Client',
            client_email: cf.user_email || '',
            client_phone: cf.user_phone || '',
            product: it,
          });
        }
      });
    });
    return pairs;
  }, [clientFavorites]);

  const filteredClientPairs = useMemo(() => {
    if (!favSearch.trim()) return allClientProductPairs;
    const q = favSearch.toLowerCase();
    return allClientProductPairs.filter(
      (cp) =>
        (cp.client_name && cp.client_name.toLowerCase().includes(q)) ||
        (cp.client_email && cp.client_email.toLowerCase().includes(q)) ||
        (cp.client_phone && cp.client_phone.toLowerCase().includes(q)) ||
        (cp.product?.name && cp.product.name.toLowerCase().includes(q)) ||
        (cp.product?.brand && cp.product.brand.toLowerCase().includes(q)) ||
        (cp.product?.category && cp.product.category.toLowerCase().includes(q))
    );
  }, [allClientProductPairs, favSearch]);

  const filteredClientFavorites = useMemo(() => {
    if (!favSearch.trim()) return Array.isArray(clientFavorites) ? clientFavorites : [];
    const q = favSearch.toLowerCase();
    return (Array.isArray(clientFavorites) ? clientFavorites : [])
      .map((cf) => {
        const clientMatches =
          (cf.user_name && cf.user_name.toLowerCase().includes(q)) ||
          (cf.user_email && cf.user_email.toLowerCase().includes(q)) ||
          (cf.user_phone && cf.user_phone.toLowerCase().includes(q));
        const matchedItems = (cf.items || []).filter(
          (it) =>
            clientMatches ||
            (it.name && it.name.toLowerCase().includes(q)) ||
            (it.brand && it.brand.toLowerCase().includes(q)) ||
            (it.category && it.category.toLowerCase().includes(q))
        );
        return { ...cf, items: matchedItems };
      })
      .filter((cf) => cf.items.length > 0);
  }, [clientFavorites, favSearch]);
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api(`/admin/orders/${orderId}/status`, { method: 'PUT', body: { status: newStatus } });
      notify(`Statut de la commande #${orderId} mis à jour : ${STATUS[newStatus]?.[0] || newStatus}`);
      loadAdminData();
      if (selected && selected.id === orderId) {
        setSelected({ ...selected, status: newStatus });
      }
    } catch (e) {
      notify(e.message);
    }
  };

  const cancel = async (o) => {
    if (!window.confirm(`Annuler la commande ${cmd(o.id)} ?`)) return;
    try {
      await api(`/orders/${o.id}/cancel`, { method: 'PUT' });
      notify('Commande annulée');
      setSelected(null);
      loadUserData();
      if (isAdmin) loadAdminData();
    } catch (e) {
      notify(e.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/auth/me', { method: 'PUT', body: profile });
      setUser(res);
      setProfile((prev) => ({ ...prev, password: '' }));
      notify('Informations personnelles mises à jour avec succès');
    } catch (err) {
      notify(err.message);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await api('/addresses', { method: 'POST', body: addr });
      setAddr({ label: 'Domicile', full_name: '', phone: '', address: '', city: '', postal_code: '' });
      notify('Adresse ajoutée avec succès');
      loadUserData();
    } catch (err) {
      notify(err.message);
    }
  };

  const delAddress = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) return;
    try {
      await api(`/addresses/${id}`, { method: 'DELETE' });
      notify('Adresse supprimée avec succès');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      loadUserData();
    } catch (err) {
      notify(err.message || 'Erreur lors de la suppression');
    }
  };

  const out = async () => {
    await logout();
    navigate('/');
  };

  const handleAddAllFavoritesToCart = () => {
    let count = 0;
    favProducts.forEach((p) => {
      if (p.stock > 0) {
        addToCart(p);
        count++;
      }
    });
    if (count > 0) {
      notify(`${count} article(s) favori(s) ajouté(s) à votre panier !`);
    } else {
      notify('Aucun article disponible en stock.');
    }
  };

  // Product CRUD
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      await api('/products', { method: 'POST', body: newProduct });
      setNewProduct({
        name: '', brand: '', category: 'Smartphones', price: '', old_price: '',
        stock: '10', colors: '', storages: '', image_url: '', description: '',
      });
      setShowAddModal(false);
      await loadProducts();
      notify('Article ajouté avec succès');
    } catch (err) {
      notify(err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Supprimer l'article « ${p.name} » ?`)) return;
    try {
      await api(`/products/${p.id}`, { method: 'DELETE' });
      await loadProducts();
      notify('Article supprimé du catalogue');
    } catch (err) {
      notify(err.message);
    }
  };

  const handleQuickDelete = async (e) => {
    e.preventDefault();
    if (!selectedToDelete) return;
    const target = products.find((p) => String(p.id) === String(selectedToDelete));
    if (!target) return;
    await handleDeleteProduct(target);
    setShowDeleteModal(false);
    setSelectedToDelete('');
  };

  const handleEditClick = (p) => {
    setEditingProduct({
      id: p.id,
      name: p.name || '',
      brand: p.brand || '',
      category: p.category || 'Smartphones',
      price: p.price || '',
      old_price: p.old_price || '',
      stock: p.stock ?? 10,
      colors: p.colors || '',
      storages: p.storages || '',
      image_url: p.image_url || '',
      description: p.description || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      await api(`/products/${editingProduct.id}`, { method: 'PUT', body: editingProduct });
      setShowEditModal(false);
      setEditingProduct(null);
      await loadProducts();
      notify('Article mis à jour avec succès');
    } catch (err) {
      notify(err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  // Filtered Products in Articles tab
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
  }, [products, productSearch]);

  // Filtered Admin Orders
  const filteredAdminOrders = useMemo(() => {
    if (adminOrderFilter === 'all') return adminOrders;
    return adminOrders.filter((o) => o.status === adminOrderFilter);
  }, [adminOrders, adminOrderFilter]);

  // Flash Promos
  const promoProducts = useMemo(() => {
    return products.filter((p) => p.old_price && Number(p.old_price) > Number(p.price));
  }, [products]);

  // Active tab resolver
  const activeTab = useMemo(() => {
    if (!tab) return isAdmin ? 'tableau-de-bord' : 'mes-commandes';
    if (tab === 'commandes') return isAdmin ? 'articles' : 'mes-commandes';
    return tab;
  }, [tab, isAdmin]);

  if (!authReady) return <div className="page"><p className="muted">Chargement…</p></div>;
  if (!user) return <Navigate to="/connexion?redirect=/compte" replace />;

  return (
    <div className="dash">
      {/* SIDEBAR NAVIGATION */}
      <aside className="dash-side">
        {/* User Card */}
        <div className="who">
          <span className="avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</span>
          <div>
            <b>{user?.name || 'Utilisateur'}</b>
            <small>{user?.email || ''}</small>
            <div style={{ marginTop: '.25rem' }}>
              <span className={`pill ${isAdmin ? 'green' : 'blue'}`} style={{ fontSize: '.7rem', padding: '.15rem .5rem' }}>
                {isAdmin ? 'Administrateur' : 'Compte Client'}
              </span>
            </div>
          </div>
        </div>

        <nav>
          {/* SECTION ADMINISTRATION (VISIBLE UNIQUEMENT PAR L'ADMIN) */}
          {isAdmin && (
            <div className="dash-nav-section">
              <p className="dash-nav-header">ADMINISTRATION</p>
              <NavLink end to="/compte" className={activeTab === 'tableau-de-bord' ? 'active' : ''}>
                <LayoutDashboard size={17} /> Tableau de bord
              </NavLink>
              <NavLink to="/compte/commandes-clients" className={activeTab === 'commandes-clients' ? 'active' : ''}>
                <ShoppingBag size={17} /> Commandes clients
                {adminOrders.filter((o) => o.status === 'processing').length > 0 && (
                  <span className="pill orange" style={{ marginLeft: 'auto', fontSize: '.7rem', padding: '.1rem .4rem' }}>
                    {adminOrders.filter((o) => o.status === 'processing').length}
                  </span>
                )}
              </NavLink>
              <NavLink to="/compte/articles" className={activeTab === 'articles' ? 'active' : ''}>
                <Package size={17} /> Gestion des articles
              </NavLink>
              <NavLink to="/compte/categories-promos" className={activeTab === 'categories-promos' ? 'active' : ''}>
                <Tag size={17} /> Catégories &amp; Promos
              </NavLink>
              <NavLink to="/compte/clients" className={activeTab === 'clients' ? 'active' : ''}>
                <Users size={17} /> Clients
              </NavLink>
              <NavLink to="/compte/statistiques" className={activeTab === 'statistiques' ? 'active' : ''}>
                <BarChart3 size={17} /> Statistiques
              </NavLink>
            </div>
          )}

          {/* SECTION MON COMPTE (VISIBLE PAR TOUS) */}
          <div className="dash-nav-section">
            <p className="dash-nav-header">MON COMPTE</p>
            <NavLink to="/compte/mes-commandes" className={activeTab === 'mes-commandes' ? 'active' : ''}>
              <Truck size={17} /> Mes commandes
              {orders.length > 0 && (
                <span className="pill blue" style={{ marginLeft: 'auto', fontSize: '.7rem', padding: '.1rem .4rem' }}>
                  {orders.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/compte/informations" className={activeTab === 'informations' ? 'active' : ''}>
              <User size={17} /> Mes informations
            </NavLink>
            <NavLink to="/compte/adresses" className={activeTab === 'adresses' ? 'active' : ''}>
              <MapPin size={17} /> Mes adresses
            </NavLink>
            <NavLink to="/compte/favoris" className={activeTab === 'favoris' ? 'active' : ''}>
              <Heart size={17} /> Mes favoris
              {favProducts.length > 0 && (
                <span className="pill pink" style={{ marginLeft: 'auto', fontSize: '.7rem', padding: '.1rem .4rem' }}>
                  {favProducts.length}
                </span>
              )}
            </NavLink>
          </div>
        </nav>

        {/* BAS DU MENU: DÉCONNEXION */}
        <button className="logout" onClick={out} title="Se déconnecter du compte">
          <LogOut size={17} /> Déconnexion
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dash-main">
        {/* ========================================================= */}
        {/* 1. TABLEAU DE BORD (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'tableau-de-bord' && isAdmin && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1>Tableau de bord administrateur</h1>
                <p className="muted">Vue globale des performances de la boutique Expressor en temps réel</p>
              </div>
              <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                <Link to="/compte/articles" className="btn btn-primary" style={{ padding: '.5rem 1rem', fontSize: '.88rem' }}>
                  <Package size={15} /> Gérer les articles ({products.length})
                </Link>
                <Link to="/compte/commandes-clients" className="btn btn-light" style={{ padding: '.5rem 1rem', fontSize: '.88rem' }}>
                  <ShoppingBag size={15} /> Commandes clients ({adminOrders.length})
                </Link>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="stats">
              <div className="stat">
                <span className="ico green"><TrendingUp size={20} /></span>
                <div>
                  <b>{money(adminStats?.total_revenue || 0)}</b>
                  <small>Chiffre d'affaires</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico yellow"><ShoppingBag size={20} /></span>
                <div>
                  <b>{adminStats?.total_orders || adminOrders.length}</b>
                  <small>Commandes reçues</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico blue"><CreditCard size={20} /></span>
                <div>
                  <b>{money(adminStats?.avg_order || 0)}</b>
                  <small>Panier moyen</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico violet"><Layers size={20} /></span>
                <div>
                  <b>{adminStats?.total_stock || 0}</b>
                  <small>Unités en stock</small>
                </div>
              </div>
            </div>

            {/* Dernières Commandes Clients */}
            <div className="section-head" style={{ marginTop: '1rem' }}>
              <div>
                <h2>Dernières commandes clients</h2>
                <p className="muted">Commandes passées récemment sur la boutique</p>
              </div>
              <Link to="/compte/commandes-clients" className="link">Voir toutes les commandes ({adminOrders.length}) →</Link>
            </div>

            {adminOrders.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>N° Commande</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminOrders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td data-l="N°">{cmd(o.id)}</td>
                        <td data-l="Client">
                          <b>{o.client_name || o.full_name}</b>
                          <br /><small className="muted">{o.client_email}</small>
                        </td>
                        <td data-l="Date">{fmtDate(o.created_at)}</td>
                        <td data-l="Statut"><Badge status={o.status} /></td>
                        <td data-l="Total"><b>{money(o.total)}</b></td>
                        <td data-l="Action">
                          <button className="link" onClick={() => setSelected(o)}>Gérer</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty">Aucune commande pour le moment.</p>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 2. COMMANDES CLIENTS (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'commandes-clients' && isAdmin && (
          <>
            <div className="section-head" style={{ alignItems: 'center' }}>
              <div>
                <h1>Commandes clients</h1>
                <p className="muted">Gérer, valider et expédier les commandes des clients</p>
              </div>
              <button
                className="btn btn-light"
                onClick={loadAdminData}
                disabled={loadingAdminData}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', height: '38px' }}
              >
                <RefreshCw size={14} className={loadingAdminData ? 'spin' : ''} /> {loadingAdminData ? 'Actualisation…' : 'Actualiser'}
              </button>
            </div>

            {/* Filter Pills */}
            <div className="filter-pills">
              {[
                ['all', `Toutes (${adminOrders.length})`],
                ['processing', `En cours (${adminOrders.filter((o) => o.status === 'processing').length})`],
                ['shipped', `Expédiées (${adminOrders.filter((o) => o.status === 'shipped').length})`],
                ['delivered', `Livrées (${adminOrders.filter((o) => o.status === 'delivered').length})`],
                ['cancelled', `Annulées (${adminOrders.filter((o) => o.status === 'cancelled').length})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-pill ${adminOrderFilter === key ? 'active' : ''}`}
                  onClick={() => setAdminOrderFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredAdminOrders.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>N° Commande</th>
                      <th>Client</th>
                      <th>Téléphone</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Statut</th>
                      <th>Changer statut</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdminOrders.map((o) => (
                      <tr key={o.id}>
                        <td data-l="N°">{cmd(o.id)}</td>
                        <td data-l="Client">
                          <b>{o.client_name || o.full_name}</b>
                          <br /><small className="muted">{o.client_email}</small>
                        </td>
                        <td data-l="Téléphone">{o.phone}</td>
                        <td data-l="Date">{fmtDate(o.created_at)}</td>
                        <td data-l="Total"><b>{money(o.total)}</b></td>
                        <td data-l="Statut"><Badge status={o.status} /></td>
                        <td data-l="Changer statut">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            style={{
                              padding: '.3rem .6rem',
                              borderRadius: '8px',
                              background: 'var(--soft)',
                              color: '#fff',
                              border: '1px solid var(--line)',
                              fontSize: '.85rem',
                            }}
                          >
                            <option value="processing">En cours</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td data-l="Détails">
                          <button className="btn btn-light" style={{ padding: '.25rem .65rem', fontSize: '.8rem' }} onClick={() => setSelected(o)}>
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty">Aucune commande correspondant à ce filtre.</p>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 3. GESTION DES ARTICLES (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'articles' && isAdmin && (
          <>
            <div className="section-head" style={{ alignItems: 'center' }}>
              <div>
                <h1>Gestion des articles</h1>
                <p className="muted">Ajouter, modifier ou supprimer les smartphones, accessoires et niveaux de stock</p>
              </div>
              <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  className="btn btn-dark"
                  onClick={() => setShowAddModal(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', height: '40px' }}
                >
                  <Plus size={16} /> Ajouter un article
                </button>
                <button
                  className="btn btn-light danger-text"
                  onClick={() => setShowDeleteModal(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', height: '40px', borderColor: '#fca5a5' }}
                >
                  <Trash2 size={16} /> Supprimer un article
                </button>
              </div>
            </div>

            {/* Quick search input */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="nav-search" style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--line)', padding: '.2rem .8rem' }}>
                <input
                  style={{ width: '100%', padding: '.5rem 0' }}
                  placeholder="Filtrer un article par nom, marque ou catégorie..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table of products */}
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}></th>
                    <th>Article</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Ancien prix</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="mini" style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden' }}>
                          <ProductImage product={p} />
                        </div>
                      </td>
                      <td data-l="Article">
                        <b>{p.name}</b>
                        {p.brand && <small className="muted" style={{ display: 'block' }}>{p.brand}</small>}
                      </td>
                      <td data-l="Catégorie">
                        <span className="pill dark">{p.category}</span>
                      </td>
                      <td data-l="Prix"><b>{money(p.price)}</b></td>
                      <td data-l="Ancien prix">
                        {p.old_price ? <s>{money(p.old_price)}</s> : <span className="muted">-</span>}
                      </td>
                      <td data-l="Stock">
                        <span className={`pill ${p.stock > 5 ? 'green' : p.stock > 0 ? 'orange' : 'red'}`}>
                          {p.stock} unité(s)
                        </span>
                      </td>
                      <td data-l="Actions" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-light"
                            style={{ padding: '.3rem .6rem', fontSize: '.8rem' }}
                            onClick={() => handleEditClick(p)}
                          >
                            <Pencil size={13} /> Modifier
                          </button>
                          <button
                            type="button"
                            className="icon-btn danger"
                            style={{ width: 32, height: 32 }}
                            onClick={() => handleDeleteProduct(p)}
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 4. CATÉGORIES & PROMOS (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'categories-promos' && isAdmin && (
          <>
            <div>
              <h1>Catégories &amp; Promotions</h1>
              <p className="muted">Gérer les catégories de produits, les réductions et les ventes flash</p>
            </div>

            {/* Category summary cards */}
            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div className="stat">
                <span className="ico blue"><Package size={20} /></span>
                <div>
                  <b>{products.filter((p) => p.category === 'Smartphones').length} smartphones</b>
                  <small>
                    Stock : {products.filter((p) => p.category === 'Smartphones').reduce((a, b) => a + Number(b.stock || 0), 0)} unités
                  </small>
                </div>
              </div>
              <div className="stat">
                <span className="ico green"><Sparkles size={20} /></span>
                <div>
                  <b>{products.filter((p) => p.category === 'Accessoires').length} accessoires</b>
                  <small>
                    Stock : {products.filter((p) => p.category === 'Accessoires').reduce((a, b) => a + Number(b.stock || 0), 0)} unités
                  </small>
                </div>
              </div>
              <div className="stat">
                <span className="ico yellow"><Percent size={20} /></span>
                <div>
                  <b>{promoProducts.length} articles en promotion</b>
                  <small>Ventes flash actives</small>
                </div>
              </div>
            </div>

            {/* Active Promo Codes */}
            <div className="section-head" style={{ marginTop: '1rem' }}>
              <div>
                <h2>Codes promotionnels actifs</h2>
                <p className="muted">Codes que les clients peuvent utiliser lors du paiement</p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code Promo</th>
                    <th>Réduction</th>
                    <th>Description</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b style={{ color: 'var(--primary)', letterSpacing: '.05em' }}>PROMO10</b></td>
                    <td><span className="pill green">-10%</span></td>
                    <td>Offre spéciale sur l'ensemble du panier</td>
                    <td><span className="pill green">Actif</span></td>
                  </tr>
                  <tr>
                    <td><b style={{ color: 'var(--primary)', letterSpacing: '.05em' }}>WELCOME5</b></td>
                    <td><span className="pill green">-5%</span></td>
                    <td>Remise de bienvenue pour les nouveaux clients</td>
                    <td><span className="pill green">Actif</span></td>
                  </tr>
                  <tr>
                    <td><b style={{ color: 'var(--primary)', letterSpacing: '.05em' }}>PHONE15</b></td>
                    <td><span className="pill green">-15%</span></td>
                    <td>Réduction VIP haute technologie</td>
                    <td><span className="pill green">Actif</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Flash Sales & Promos Products Table */}
            <div className="section-head" style={{ marginTop: '1.5rem' }}>
              <div>
                <h2>Articles en Promotion Flash ({promoProducts.length})</h2>
                <p className="muted">Ces articles s'affichent automatiquement dans le carrousel des Promotions</p>
              </div>
            </div>

            {promoProducts.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 50 }}></th>
                      <th>Article</th>
                      <th>Catégorie</th>
                      <th>Prix Promo</th>
                      <th>Prix d'origine</th>
                      <th>Remise</th>
                      <th>Économie</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promoProducts.map((p) => {
                      const discount = Math.round((1 - p.price / p.old_price) * 100);
                      const saving = Math.round(Number(p.old_price) - Number(p.price));
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="mini" style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden' }}>
                              <ProductImage product={p} />
                            </div>
                          </td>
                          <td data-l="Article"><b>{p.name}</b></td>
                          <td data-l="Catégorie">{p.category}</td>
                          <td data-l="Prix Promo"><b style={{ color: 'var(--primary)' }}>{money(p.price)}</b></td>
                          <td data-l="Prix d'origine"><s>{money(p.old_price)}</s></td>
                          <td data-l="Remise"><span className="pill red">-{discount}%</span></td>
                          <td data-l="Économie"><span className="pill green">-{money(saving)}</span></td>
                          <td data-l="Action" style={{ textAlign: 'right' }}>
                            <button className="btn btn-light" style={{ padding: '.25rem .65rem', fontSize: '.8rem' }} onClick={() => handleEditClick(p)}>
                              Modifier la promo
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty">Aucun produit n'a de promotion active actuellement.</p>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 5. CLIENTS (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'clients' && isAdmin && (
          <>
            <div className="section-head" style={{ alignItems: 'center' }}>
              <div>
                <h1>Comptes clients</h1>
                <p className="muted">Voir la liste des comptes clients inscrits et leur historique d'achat</p>
              </div>
              <button
                className="btn btn-light"
                onClick={loadAdminData}
                disabled={loadingAdminData}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', height: '38px' }}
              >
                <RefreshCw size={14} className={loadingAdminData ? 'spin' : ''} /> {loadingAdminData ? 'Actualisation…' : 'Actualiser'}
              </button>
            </div>

            {/* Quick KPI stats */}
            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div className="stat">
                <span className="ico blue"><Users size={20} /></span>
                <div>
                  <b>{adminUsers.length} comptes</b>
                  <small>Clients et administrateurs</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico green"><ShoppingBag size={20} /></span>
                <div>
                  <b>{adminUsers.filter((u) => Number(u.orders_count) > 0).length} acheteurs</b>
                  <small>Ont déjà commandé</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico yellow"><CreditCard size={20} /></span>
                <div>
                  <b>{money(adminUsers.reduce((s, u) => s + Number(u.total_spent || 0), 0))}</b>
                  <small>Dépenses cumulées</small>
                </div>
              </div>
            </div>

            {/* Clients Table */}
            {adminUsers.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 50 }}></th>
                      <th>Client</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Commandes</th>
                      <th>Dépenses totales</th>
                      <th>Inscrit le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <span
                            className="avatar"
                            style={{
                              width: 36,
                              height: 36,
                              fontSize: '.9rem',
                              background: u.role === 'admin' ? 'var(--primary)' : 'var(--blue)',
                            }}
                          >
                            {(u.name || 'C').slice(0, 1).toUpperCase()}
                          </span>
                        </td>
                        <td data-l="Client"><b>{u.name || 'Client'}</b></td>
                        <td data-l="Email">{u.email}</td>
                        <td data-l="Téléphone">{u.phone || <span className="muted">-</span>}</td>
                        <td data-l="Rôle">
                          <span className={`pill ${u.role === 'admin' ? 'green' : 'blue'}`}>
                            {u.role === 'admin' ? 'Admin' : 'Client'}
                          </span>
                        </td>
                        <td data-l="Commandes"><b>{u.orders_count || 0}</b></td>
                        <td data-l="Dépenses"><b>{money(u.total_spent || 0)}</b></td>
                        <td data-l="Inscrit le">{fmtDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty">Aucun compte client trouvé.</p>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 6. STATISTIQUES (ADMIN) */}
        {/* ========================================================= */}
        {activeTab === 'statistiques' && isAdmin && (
          <>
            <div className="section-head" style={{ alignItems: 'center' }}>
              <div>
                <h1>Statistiques &amp; Performances</h1>
                <p className="muted">Analyser les ventes, les revenus et les stocks en temps réel</p>
              </div>
              <button
                className="btn btn-light"
                onClick={loadAdminData}
                disabled={loadingAdminData}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', height: '38px' }}
              >
                <RefreshCw size={14} className={loadingAdminData ? 'spin' : ''} /> {loadingAdminData ? 'Actualisation…' : 'Actualiser'}
              </button>
            </div>

            {/* 6 KPI Cards */}
            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div className="stat">
                <span className="ico green"><TrendingUp size={20} /></span>
                <div>
                  <b>{money(adminStats?.total_revenue || 0)}</b>
                  <small>Chiffre d'affaires</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico yellow"><ShoppingBag size={20} /></span>
                <div>
                  <b>{adminStats?.total_orders || adminOrders.length}</b>
                  <small>Commandes totales</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico blue"><CreditCard size={20} /></span>
                <div>
                  <b>{money(adminStats?.avg_order || 0)}</b>
                  <small>Panier moyen</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico dark"><Package size={20} /></span>
                <div>
                  <b>{products.length}</b>
                  <small>Articles référencés</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico violet"><Layers size={20} /></span>
                <div>
                  <b>{adminStats?.total_stock || 0}</b>
                  <small>Unités en stock</small>
                </div>
              </div>
              <div className="stat">
                <span className="ico pink"><CreditCard size={20} /></span>
                <div>
                  <b>{money(adminStats?.inventory_value || 0)}</b>
                  <small>Valeur totale du stock</small>
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              <div className="form-card">
                <h3>Répartition par catégorie</h3>
                {adminStats?.category_breakdown?.map((cat) => {
                  const pct = adminStats.total_products ? Math.round((cat.count / adminStats.total_products) * 100) : 0;
                  return (
                    <div key={cat.category} style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem', marginBottom: '.3rem' }}>
                        <b>{cat.category}</b>
                        <span>{cat.count} réf. ({pct}%) · {cat.stock} unités</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--soft)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: cat.category === 'Smartphones' ? 'var(--blue)' : 'var(--green)', borderRadius: '99px' }} />
                      </div>
                      <small style={{ color: 'var(--muted)', marginTop: '.2rem' }}>Valeur marchande : {money(cat.value)}</small>
                    </div>
                  );
                })}
              </div>

              <div className="form-card">
                <h3>Commandes par statut</h3>
                <div style={{ display: 'grid', gap: '.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem', background: 'var(--soft)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span className="pill orange">En cours (processing)</span>
                    </div>
                    <b>{adminOrders.filter((s) => s.status === 'processing').length}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem', background: 'var(--soft)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span className="pill blue">Expédiée (shipped)</span>
                    </div>
                    <b>{adminOrders.filter((s) => s.status === 'shipped').length}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem', background: 'var(--soft)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span className="pill green">Livrée (delivered)</span>
                    </div>
                    <b>{adminOrders.filter((s) => s.status === 'delivered').length}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem', background: 'var(--soft)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <span className="pill red">Annulée (cancelled)</span>
                    </div>
                    <b>{adminOrders.filter((s) => s.status === 'cancelled').length}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Low stock alerts */}
            <div style={{ marginTop: '1.5rem' }}>
              <div className="section-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <AlertTriangle size={18} color="var(--red)" />
                  <h2>Alertes stock faible (≤ 5 unités)</h2>
                </div>
                <Link to="/compte/articles" className="link">Gérer tous les stocks →</Link>
              </div>
              {adminStats?.low_stock?.length ? (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr><th>Article</th><th>Catégorie</th><th>Prix</th><th>Stock restant</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {adminStats.low_stock.map((p) => (
                        <tr key={p.id}>
                          <td><b>{p.name}</b></td>
                          <td>{p.category}</td>
                          <td>{money(p.price)}</td>
                          <td><span className="pill red">{p.stock} restant(s)</span></td>
                          <td>
                            <button
                              className="btn btn-light"
                              style={{ padding: '.25rem .65rem', fontSize: '.75rem', height: '28px' }}
                              onClick={() => {
                                navigate('/compte/articles');
                                setTimeout(() => handleEditClick(p), 100);
                              }}
                            >
                              Réapprovisionner
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="notice ok-box">✓ Tous les articles ont un niveau de stock satisfaisant.</p>
              )}
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 7. MES COMMANDES (MON COMPTE) */}
        {/* ========================================================= */}
        {activeTab === 'mes-commandes' && (
          <>
            <div>
              <h1>Mes commandes</h1>
              <p className="muted">Suivre vos achats et voir l'historique de vos commandes passées</p>
            </div>
            <OrdersTable orders={orders} onOpen={setSelected} />
          </>
        )}

        {/* ========================================================= */}
        {/* 8. MES INFORMATIONS (MON COMPTE) */}
        {/* ========================================================= */}
        {activeTab === 'informations' && (
          <>
            <div>
              <h1>Mes informations</h1>
              <p className="muted">Modifier votre nom, email, téléphone et mot de passe de connexion</p>
            </div>

            <form className="form-card" onSubmit={saveProfile}>
              <div className="field">
                <label>Nom complet *</label>
                <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Adresse email *</label>
                <input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Numéro de téléphone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+212 600 000000" />
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                <div className="field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <Lock size={15} /> Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    placeholder="Laissez vide pour conserver votre mot de passe actuel"
                  />
                  <small className="muted" style={{ display: 'block', marginTop: '.3rem' }}>
                    Minimum 6 caractères. Laissez vide si vous ne souhaitez pas modifier votre mot de passe.
                  </small>
                </div>
              </div>

              <button className="btn btn-dark" style={{ marginTop: '.5rem' }}>Enregistrer les modifications</button>
            </form>
          </>
        )}

        {/* ========================================================= */}
        {/* 9. MES ADRESSES (MON COMPTE) */}
        {/* ========================================================= */}
        {activeTab === 'adresses' && (
          <>
            <div>
              <h1>Mes adresses</h1>
              <p className="muted">Gérer vos adresses de livraison pour vos commandes</p>
            </div>

            <div className="addr-grid">
              {addresses.map((a) => (
                <div className="addr" key={a.id}>
                  <div className="addr-header">
                    <div className="addr-header-title">
                      <b>{a.label || 'Adresse'}</b>
                      <span className="pill green" style={{ fontSize: '.7rem', padding: '.15rem .5rem' }}>Enregistrée</span>
                    </div>
                    <button 
                      type="button"
                      className="icon-btn danger" 
                      onClick={() => delAddress(a.id)} 
                      title="Supprimer cette adresse"
                      aria-label="Supprimer cette adresse"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="addr-body">
                    {a.full_name && <p className="addr-name"><strong>{a.full_name}</strong></p>}
                    <p className="addr-line">{a.address}</p>
                    <p className="addr-line">{a.postal_code ? `${a.postal_code} ` : ''}{a.city}</p>
                    {a.phone && <p className="addr-phone">📞 {a.phone}</p>}
                  </div>
                </div>
              ))}
              {!addresses.length && <p className="empty">Aucune adresse de livraison enregistrée pour le moment.</p>}
            </div>

            <form className="form-card" onSubmit={addAddress}>
              <h3>Ajouter une adresse</h3>
              <div className="two">
                <div className="field">
                  <label>Libellé</label>
                  <input value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} placeholder="Domicile, Bureau..." />
                </div>
                <div className="field">
                  <label>Nom complet *</label>
                  <input required value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} placeholder="ex: Jean Dupont" />
                </div>
              </div>
              <div className="field">
                <label>Adresse de livraison *</label>
                <input required value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} placeholder="Numéro, rue, appartement..." />
              </div>
              <div className="two">
                <div className="field">
                  <label>Ville *</label>
                  <input required value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} placeholder="Casablanca, Rabat, Tanger..." />
                </div>
                <div className="field">
                  <label>Code postal</label>
                  <input value={addr.postal_code} onChange={(e) => setAddr({ ...addr, postal_code: e.target.value })} placeholder="20000" />
                </div>
              </div>
              <div className="field">
                <label>Téléphone de contact</label>
                <input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="+212 600 000000" />
              </div>
              <button className="btn btn-dark">Ajouter</button>
            </form>
          </>
        )}

        {/* ========================================================= */}
        {/* 10. MES FAVORIS (SHOW CLIENT AND ITS FAVORITE PRODUCT) */}
        {/* ========================================================= */}
        {activeTab === 'favoris' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <Heart size={26} color="var(--primary)" />
                  {isAdmin && favViewMode === 'clients' ? 'Nom du client & Produits favoris' : 'Mes favoris'}
                </h1>
                <p className="muted" style={{ margin: '.3rem 0 0' }}>
                  {isAdmin && favViewMode === 'clients'
                    ? 'Consultez les clients Expressor et leurs produits favoris sauvegardés'
                    : `Client : ${user.name} — Vos articles sauvegardés`}
                </p>
              </div>

              {isAdmin && (
                <div className="tabs" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className={favViewMode === 'clients' ? 'on' : ''}
                    onClick={() => setFavViewMode('clients')}
                  >
                    <Users size={14} style={{ marginRight: '.4rem' }} /> Clients & leurs favoris ({clientFavorites.length} clients · {allClientProductPairs.length} favoris)
                  </button>
                  <button
                    type="button"
                    className={favViewMode === 'perso' ? 'on' : ''}
                    onClick={() => setFavViewMode('perso')}
                  >
                    <User size={14} style={{ marginRight: '.4rem' }} /> Mes favoris personnels ({favProducts.length})
                  </button>
                </div>
              )}
            </div>

            {/* VUE ADMIN : CLIENTS & LEURS FAVORIS */}
            {isAdmin && favViewMode === 'clients' ? (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {/* STATS RAPIDES */}
                <div className="stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="muted" style={{ fontSize: '.85rem' }}>Clients avec favoris</span>
                      <Users size={18} color="var(--secondary)" />
                    </div>
                    <b style={{ fontSize: '1.75rem', marginTop: '.35rem', display: 'block' }}>{clientFavorites.length}</b>
                    <small className="muted">Comptes avec articles enregistrés</small>
                  </div>
                  <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="muted" style={{ fontSize: '.85rem' }}>Total articles favoris</span>
                      <Heart size={18} color="var(--primary)" />
                    </div>
                    <b style={{ fontSize: '1.75rem', marginTop: '.35rem', display: 'block' }}>{allClientProductPairs.length}</b>
                    <small className="muted">Articles mis de côté</small>
                  </div>
                  <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="muted" style={{ fontSize: '.85rem' }}>Valeur totale souhaitée</span>
                      <ShoppingBag size={18} color="#a78bfa" />
                    </div>
                    <b style={{ fontSize: '1.75rem', marginTop: '.35rem', display: 'block', color: 'var(--primary)' }}>
                      {money(allClientProductPairs.reduce((s, p) => s + Number(p.product.price || 0), 0))}
                    </b>
                    <small className="muted">Potentiel de conversion d'achat</small>
                  </div>
                </div>

                {/* BARRE DE RECHERCHE ET COMMANDE D'AFFICHAGE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '480px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-dark)' }} />
                    <input
                      type="text"
                      placeholder="Rechercher par nom de client, email ou produit..."
                      value={favSearch}
                      onChange={(e) => setFavSearch(e.target.value)}
                      style={{ paddingLeft: '2.6rem', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <span className="muted" style={{ fontSize: '.85rem' }}>Affichage :</span>
                    <button
                      type="button"
                      className={`btn btn-sm ${favDisplayFormat === 'table' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFavDisplayFormat('table')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}
                    >
                      <List size={14} /> Tableau direct
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${favDisplayFormat === 'cards' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFavDisplayFormat('cards')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}
                    >
                      <LayoutGrid size={14} /> Vue par Client
                    </button>
                  </div>
                </div>

                {/* FORMAT 1: TABLEAU DE CORRESPONDANCE DIRECT CLIENT ➔ PRODUIT */}
                {favDisplayFormat === 'table' ? (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: '28%' }}>Nom du client</th>
                          <th style={{ width: '32%' }}>Produit favori</th>
                          <th>Catégorie</th>
                          <th>Prix</th>
                          <th>Stock</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClientPairs.length ? (
                          filteredClientPairs.map((pair, idx) => (
                            <tr key={`${pair.user_id}-${pair.product.id}-${idx}`}>
                              <td data-l="Nom du client">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                                  <div
                                    className="avatar"
                                    style={{
                                      width: 38,
                                      height: 38,
                                      fontSize: '.95rem',
                                      background: 'linear-gradient(135deg, var(--blue), var(--secondary))',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {(pair.client_name || 'C').slice(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                    <b style={{ color: '#ffffff', display: 'block', fontSize: '1rem' }}>
                                      {pair.client_name || 'Client'}
                                    </b>
                                    <small className="muted" style={{ fontSize: '.8rem', display: 'block' }}>
                                      {pair.client_email}
                                    </small>
                                    {pair.client_phone && (
                                      <small className="muted" style={{ fontSize: '.75rem', display: 'block', color: 'var(--secondary)' }}>
                                        {pair.client_phone}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td data-l="Produit favori">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                                  <div
                                    style={{
                                      width: 54,
                                      height: 54,
                                      background: 'rgba(255,255,255,0.04)',
                                      borderRadius: '10px',
                                      border: '1px solid var(--line)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      flexShrink: 0,
                                      overflow: 'hidden',
                                      padding: '4px',
                                    }}
                                  >
                                    <ProductImage product={pair.product} />
                                  </div>
                                  <div>
                                    <b style={{ color: 'var(--primary)', fontSize: '.95rem', display: 'block' }}>
                                      {pair.product.name}
                                    </b>
                                    {pair.product.brand && (
                                      <small className="muted" style={{ fontSize: '.78rem' }}>
                                        Marque : {pair.product.brand}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td data-l="Catégorie">
                                <span className="pill dark" style={{ fontSize: '.8rem' }}>
                                  {pair.product.category}
                                </span>
                              </td>

                              <td data-l="Prix">
                                <b style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                                  {money(pair.product.price)}
                                </b>
                              </td>

                              <td data-l="Stock">
                                {pair.product.stock > 0 ? (
                                  <span className="pill green" style={{ fontSize: '.75rem' }}>
                                    En stock ({pair.product.stock})
                                  </span>
                                ) : (
                                  <span className="pill red" style={{ fontSize: '.75rem' }}>
                                    Rupture
                                  </span>
                                )}
                              </td>

                              <td data-l="Actions" style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem' }}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => addToCart(pair.product)}
                                    title="Ajouter au panier"
                                    style={{ padding: '.4rem .7rem', fontSize: '.8rem', display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}
                                  >
                                    <ShoppingCart size={13} /> Panier
                                  </button>
                                  <Link
                                    to={pair.product.category?.toLowerCase() === 'accessoires' ? '/accessoires' : '/smartphones'}
                                    className="btn btn-sm btn-outline"
                                    style={{ padding: '.4rem .7rem', fontSize: '.8rem', display: 'inline-flex', alignItems: 'center', gap: '.3rem' }}
                                  >
                                    <Eye size={13} /> Voir
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem' }} className="muted">
                              Aucun favori trouvé correspondant à votre recherche.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* FORMAT 2: VUE PAR CLIENT (GROUPÉE AVEC CARTES) */
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {filteredClientFavorites.length ? (
                      filteredClientFavorites.map((cf) => (
                        <div key={cf.user_id} className="form-card" style={{ padding: '1.5rem', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '18px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span className="avatar" style={{ width: 48, height: 48, fontSize: '1.15rem', background: 'linear-gradient(135deg, var(--blue), var(--secondary))' }}>
                                {(cf.user_name || 'C').slice(0, 1).toUpperCase()}
                              </span>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                                  <span style={{ fontSize: '.85rem', color: 'var(--muted-dark)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Client :</span>
                                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>{cf.user_name || 'Client'}</h3>
                                </div>
                                <small className="muted" style={{ fontSize: '.88rem' }}>
                                  {cf.user_email} · {cf.user_phone || 'Sans numéro de téléphone'}
                                </small>
                              </div>
                            </div>
                            <span className="pill green" style={{ fontSize: '.85rem', padding: '.4rem .85rem' }}>
                              {cf.items.length} produit(s) favori(s)
                            </span>
                          </div>

                          <div className="grid grid-4" style={{ gap: '1rem' }}>
                            {cf.items.map((it) => (
                              <div
                                key={it.id}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  borderRadius: '14px',
                                  padding: '1rem',
                                  border: '1px solid var(--line)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '.6rem',
                                  transition: 'transform .2s, border-color .2s',
                                }}
                              >
                                <div style={{ height: '120px', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                                  <ProductImage product={it} />
                                </div>
                                <b style={{ fontSize: '.98rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ffffff' }}>
                                  {it.name}
                                </b>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.9rem' }}>
                                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem' }}>{money(it.price)}</span>
                                  <small className="pill dark">{it.category}</small>
                                </div>
                                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.3rem' }}>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => addToCart(it)}
                                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem', fontSize: '.78rem', padding: '.4rem' }}
                                  >
                                    <ShoppingCart size={13} /> Panier
                                  </button>
                                  <Link
                                    to={it.category?.toLowerCase() === 'accessoires' ? '/accessoires' : '/smartphones'}
                                    className="btn btn-sm btn-outline"
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '.4rem .6rem' }}
                                    title="Voir le produit"
                                  >
                                    <Eye size={13} />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty">Aucun client ni favori correspondant.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* VUE CLIENT : MES FAVORIS PERSONNELS */
              <>
                <div className="client-favorites-hero">
                  <div className="client-favorites-profile">
                    <div className="client-favorites-avatar">
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                        <span style={{ fontSize: '.85rem', color: 'var(--muted-dark)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Client :</span>
                        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{user?.name || 'Client'}</h2>
                        <span className={`pill ${isAdmin ? 'green' : 'blue'}`} style={{ fontSize: '.75rem' }}>
                          {isAdmin ? 'Administrateur' : 'Client vérifié'}
                        </span>
                      </div>
                      <p className="muted" style={{ margin: '.2rem 0 0', fontSize: '.9rem' }}>
                        {user.email} · {user.phone || '+212 600 000000'}
                      </p>
                    </div>
                  </div>

                  <div className="client-favorites-meta">
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {favProducts.length} article(s) sauvegardé(s)
                      </div>
                      <small className="muted">Valeur totale : {money(totalFavValue)}</small>
                    </div>

                    {favProducts.length > 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={handleAddAllFavoritesToCart}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '.65rem 1.25rem' }}
                      >
                        <ShoppingCart size={16} /> Tout ajouter au panier
                      </button>
                    )}
                  </div>
                </div>

                {favProducts.length ? (
                  <div className="grid grid-3" style={{ marginTop: '1rem' }}>
                    {favProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <p className="empty" style={{ padding: '3rem 1rem' }}>
                    Votre liste de favoris est vide. <Link className="link" to="/smartphones">Découvrir les smartphones</Link> ou <Link className="link" to="/accessoires">les accessoires</Link>.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: DÉTAILS DE COMMANDE */}
      {/* ========================================================= */}
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(580px, 100%)' }}>
            <button className="icon-btn close" onClick={() => setSelected(null)} aria-label="Fermer"><X size={18} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.4rem' }}>
              <h3 style={{ margin: 0 }}>Commande {cmd(selected.id)}</h3>
              <Badge status={selected.status} />
            </div>

            <p className="muted" style={{ fontSize: '.9rem', margin: 0 }}>
              Passée le {fmtDate(selected.created_at)} par <b>{selected.client_name || selected.full_name}</b> ({selected.client_email || selected.phone})
            </p>

            {/* Delivery address */}
            <div style={{ background: 'var(--soft)', padding: '.75rem 1rem', borderRadius: '10px', margin: '1rem 0', fontSize: '.88rem' }}>
              <b style={{ display: 'block', marginBottom: '.2rem' }}>Adresse de livraison :</b>
              {selected.address}, {selected.city} {selected.postal_code || ''}<br />
              Téléphone : {selected.phone} · Paiement : {selected.payment_method === 'delivery' ? 'À la livraison' : 'Carte bancaire'}
            </div>

            {/* Articles list */}
            <div style={{ display: 'grid', gap: '.6rem', marginBottom: '1rem' }}>
              {selected.items?.map((i) => (
                <div className="row" key={i.id} style={{ padding: '.5rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span>{i.name} {[i.storage, i.color].filter(Boolean).join(' · ')} × {i.quantity}</span>
                  <b>{money(i.price * i.quantity)}</b>
                </div>
              ))}
            </div>

            {Number(selected.discount) > 0 && (
              <div className="row ok" style={{ marginBottom: '.4rem' }}>
                <span>Code promo ({selected.promo_code})</span>
                <b>-{money(selected.discount)}</b>
              </div>
            )}
            <div className="row total" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              <span>Total</span>
              <b>{money(selected.total)}</b>
            </div>

            {/* Admin status change inside modal */}
            {isAdmin && (
              <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                <span style={{ fontSize: '.85rem', fontWeight: 600 }}>Changer le statut :</span>
                {['processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`btn ${selected.status === st ? 'btn-primary' : 'btn-light'}`}
                    style={{ padding: '.3rem .65rem', fontSize: '.8rem' }}
                    onClick={() => handleUpdateOrderStatus(selected.id, st)}
                  >
                    {STATUS[st]?.[0] || st}
                  </button>
                ))}
              </div>
            )}

            {/* Client cancel button if processing */}
            {!isAdmin && selected.status === 'processing' && (
              <button className="btn btn-light danger-text" onClick={() => cancel(selected)} style={{ marginTop: '1rem' }}>
                Annuler ma commande
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER UN ARTICLE */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(640px, 100%)' }}>
            <button className="icon-btn close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            <h2>Ajouter un nouvel article</h2>
            <p className="muted">Le produit sera instantanément ajouté au catalogue Expressor :</p>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div className="two">
                <div className="field">
                  <label>Nom du produit *</label>
                  <input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="ex: iPhone 16 Pro Max" />
                </div>
                <div className="field">
                  <label>Marque</label>
                  <input value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="ex: Apple, Samsung..." />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Catégorie</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Accessoires">Accessoires</option>
                  </select>
                </div>
                <div className="field">
                  <label>Quantité en stock</label>
                  <input type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Prix (DH) *</label>
                  <input required type="number" min="0" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="ex: 14500" />
                </div>
                <div className="field">
                  <label>Ancien prix (promotion)</label>
                  <input type="number" min="0" step="0.01" value={newProduct.old_price} onChange={(e) => setNewProduct({ ...newProduct, old_price: e.target.value })} placeholder="ex: 15900" />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Couleurs (séparées par virgules)</label>
                  <input value={newProduct.colors} onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })} placeholder="Titane, Noir, Bleu" />
                </div>
                <div className="field">
                  <label>Capacités de stockage</label>
                  <input value={newProduct.storages} onChange={(e) => setNewProduct({ ...newProduct, storages: e.target.value })} placeholder="128 Go, 256 Go, 512 Go" />
                </div>
              </div>
              <ImageDropzone
                value={newProduct.image_url}
                onChange={(url) => setNewProduct({ ...newProduct, image_url: url })}
                label="Image de l'article (glissez votre photo ici)"
              />
              <div className="field">
                <label>Description</label>
                <textarea rows="3" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description détaillée..." />
              </div>
              <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '.5rem' }}>
                <button type="button" className="btn btn-light" onClick={() => setShowAddModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-dark" disabled={savingProduct}>
                  {savingProduct ? 'Enregistrement…' : 'Ajouter l\'article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MODIFIER UN ARTICLE */}
      {/* ========================================================= */}
      {showEditModal && editingProduct && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(640px, 100%)' }}>
            <button className="icon-btn close" onClick={() => setShowEditModal(false)}><X size={18} /></button>
            <h2>Modifier l'article « {editingProduct.name} »</h2>
            <form onSubmit={handleUpdateProduct} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div className="two">
                <div className="field">
                  <label>Nom du produit *</label>
                  <input required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Marque</label>
                  <input value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Catégorie</label>
                  <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Accessoires">Accessoires</option>
                  </select>
                </div>
                <div className="field">
                  <label>Quantité en stock</label>
                  <input type="number" min="0" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Prix (DH) *</label>
                  <input required type="number" min="0" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                </div>
                <div className="field">
                  <label>Ancien prix (promotion)</label>
                  <input type="number" min="0" step="0.01" value={editingProduct.old_price || ''} onChange={(e) => setEditingProduct({ ...editingProduct, old_price: e.target.value })} />
                </div>
              </div>
              <div className="two">
                <div className="field">
                  <label>Couleurs (séparées par virgules)</label>
                  <input value={editingProduct.colors} onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value })} />
                </div>
                <div className="field">
                  <label>Capacités de stockage</label>
                  <input value={editingProduct.storages} onChange={(e) => setEditingProduct({ ...editingProduct, storages: e.target.value })} />
                </div>
              </div>
              <ImageDropzone
                value={editingProduct.image_url}
                onChange={(url) => setEditingProduct({ ...editingProduct, image_url: url })}
                label="Image de l'article (glissez votre photo ici)"
              />
              <div className="field">
                <label>Description</label>
                <textarea rows="3" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end', marginTop: '.5rem' }}>
                <button type="button" className="btn btn-light" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-dark" disabled={savingProduct}>
                  {savingProduct ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SUPPRIMER UN ARTICLE */}
      {/* ========================================================= */}
      {showDeleteModal && (
        <div className="modal" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(480px, 100%)' }}>
            <button className="icon-btn close" onClick={() => setShowDeleteModal(false)}><X size={18} /></button>
            <h2>Supprimer un article</h2>
            <p className="muted">Sélectionnez le produit à retirer définitivement :</p>
            <form onSubmit={handleQuickDelete} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div className="field">
                <label>Choisir un article</label>
                <select required value={selectedToDelete} onChange={(e) => setSelectedToDelete(e.target.value)}>
                  <option value="">-- Sélectionnez un article ({products.length}) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category}) - {money(p.price)}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-light" onClick={() => setShowDeleteModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-dark" style={{ background: 'var(--red)' }} disabled={!selectedToDelete}>
                  Confirmer la suppression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
