import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useStore } from '../context/Store';

export default function Navbar() {
  const { cartCount, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    if (location.pathname !== '/') return;
    const sections = ['accueil', 'smartphones', 'accessoires', 'promotions', 'contact'];
    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      const navHeight = nav ? nav.offsetHeight : 95;
      const scrollY = window.scrollY + navHeight + 60;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/smartphones?q=${encodeURIComponent(q.trim())}`);
    setSearching(false);
    setOpen(false);
  };
  const close = () => setOpen(false);

  // Smooth scroll directly to section, positioning it right below the navbar
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    close();
    if (location.pathname === '/') {
      if (id === 'accueil') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        setActiveSection('accueil');
      } else {
        const el = document.getElementById(id);
        if (el) {
          const nav = document.querySelector('.navbar');
          const navHeight = nav ? nav.offsetHeight : 85;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
          window.history.pushState(null, '', `/#${id}`);
          setActiveSection(id);
        }
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link to="/" className="brand" onClick={scrollTo('accueil')}>EXPRESS<b>OR</b></Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#accueil" className={location.pathname === '/' && activeSection === 'accueil' ? 'active' : ''} onClick={scrollTo('accueil')}>Accueil</a>
          <a href="#smartphones" className={location.pathname === '/' && activeSection === 'smartphones' ? 'active' : ''} onClick={scrollTo('smartphones')}>Smartphones</a>
          <a href="#accessoires" className={location.pathname === '/' && activeSection === 'accessoires' ? 'active' : ''} onClick={scrollTo('accessoires')}>Accessoires</a>
          <a href="#promotions" className={location.pathname === '/' && activeSection === 'promotions' ? 'active' : ''} onClick={scrollTo('promotions')}>Promotions</a>
          <a href="#contact" className={location.pathname === '/' && activeSection === 'contact' ? 'active' : ''} onClick={scrollTo('contact')}>Contact</a>
        </nav>

        <div className="nav-actions">
          {searching ? (
            <form className="nav-search" onSubmit={submit}>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setSearching(false)}
                placeholder="Rechercher…" />
              <button type="submit" aria-label="Rechercher"><Search size={16} /></button>
            </form>
          ) : (
            <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Rechercher"><Search size={18} /></button>
          )}
          {user ? (
            <Link to="/compte" className="nav-user-pill" title={user.name}>
              <User size={15} />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <div className="nav-auth-group">
              <Link to="/connexion" className="nav-btn-signin" title="Se connecter">
                <span>Sign In</span>
              </Link>
              <Link to="/connexion?mode=register" className="nav-btn-signup" title="Créer un compte">
                <span>Sign Up</span>
              </Link>
            </div>
          )}
          <Link to="/panier" className="icon-btn" aria-label="Panier">
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
