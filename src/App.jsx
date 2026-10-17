import { Component, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/Store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Accessories from './pages/Accessories';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import './App.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="page" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.75rem' }}>Une erreur inattendue est survenue</h2>
          <p className="muted" style={{ maxWidth: 540, margin: '0 auto 1.75rem', fontSize: '1rem' }}>
            {this.state.error?.message || "Une erreur est survenue lors du chargement de la page."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}>
              Retour à l'accueil
            </button>
            <button className="btn btn-outline" onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}>
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const nav = document.querySelector('.navbar');
          const navHeight = nav ? nav.offsetHeight : 85;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return <div className="page"><p className="empty">Page introuvable. <Link className="link" to="/">Retour à l'accueil</Link></p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollTop />
        <Navbar />
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smartphones" element={<Shop mode="smartphones" />} />
          <Route path="/promotions" element={<Shop mode="promotions" />} />
          <Route path="/accessoires" element={<Accessories />} />
          <Route path="/produit/:id" element={<ProductDetails />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/compte" element={<Dashboard />} />
          <Route path="/compte/:tab" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
        <footer className="footer">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="brand" style={{ fontSize: '1.35rem' }}>EXPRESS<b>OR</b></div>
            <span>© 2026 EXPRESSOR · Société à Responsabilité Limitée à Associé Unique · Oujda, Maroc</span>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <a href="#smartphones" onClick={(e) => { e.preventDefault(); document.getElementById('smartphones')?.scrollIntoView({ behavior: 'smooth' }); }}>Smartphones</a>
              <a href="#accessoires" onClick={(e) => { e.preventDefault(); document.getElementById('accessoires')?.scrollIntoView({ behavior: 'smooth' }); }}>Accessoires</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
        </footer>
      </StoreProvider>
    </BrowserRouter>
  );
}
