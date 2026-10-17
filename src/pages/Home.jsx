import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck, ShieldCheck, BadgeCheck, Headphones, ArrowRight,
  Phone, Mail, MapPin, Globe, Camera, Play, Music2, Send,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api, money, resolveProductImage } from '../api';
import { useStore } from '../context/Store';

const BRANDS = [
  ['iPhone', 'Apple', '/products/iphone-16-pro.jpg'],
  ['Samsung', 'Samsung', '/products/galaxy-s24.jpg'],
  ['Xiaomi', 'Xiaomi', '/products/xiaomi-14.jpg'],
  ['Oppo', 'Oppo', '/products/oppo-reno12.jpg'],
];

const BRAND_FILTERS = ['Tous', 'Apple', 'Samsung', 'Xiaomi', 'Oppo'];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, error, loadProducts, notify, user, addToCart } = useStore();
  const [selectedBrand, setSelectedBrand] = useState('Tous');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: 'Question sur un produit',
    message: '',
  });
  const [contactBusy, setContactBusy] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Promotions sliding refs & handlers
  const promoSliderRef = useRef(null);
  const promoAnimRef = useRef(null);
  const slideSpeedRef = useRef(0);

  const startPromoLoop = () => {
    if (promoAnimRef.current) return;
    const step = () => {
      const el = promoSliderRef.current;
      if (el && slideSpeedRef.current !== 0) {
        const oneThird = el.scrollWidth / 3;
        el.scrollLeft += slideSpeedRef.current;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += oneThird;
        }
      }
      promoAnimRef.current = requestAnimationFrame(step);
    };
    promoAnimRef.current = requestAnimationFrame(step);
  };

  const handlePromoMouseMove = (e) => {
    const el = promoSliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 (gauche) à 1 (droite)

    // Si la souris est à droite (> 0.55), glisser vers la droite (0 à +0.65)
    // Si la souris est à gauche (< 0.45), glisser vers la gauche (-0.65 à 0)
    // Zone neutre au centre (0.45 à 0.55) pour pouvoir lire calmement
    if (relativeX > 0.55) {
      const intensity = Math.min(1, (relativeX - 0.55) / 0.35);
      slideSpeedRef.current = 0.2 + intensity * 0.5; // vitesse douce max 0.7
    } else if (relativeX < 0.45) {
      const intensity = Math.min(1, (0.45 - relativeX) / 0.35);
      slideSpeedRef.current = -(0.2 + intensity * 0.5); // vitesse douce négative vers la gauche
    } else {
      slideSpeedRef.current = 0; // Pause au milieu
    }

    startPromoLoop();
  };

  const stopPromoSlide = () => {
    slideSpeedRef.current = 0;
    if (promoAnimRef.current) {
      cancelAnimationFrame(promoAnimRef.current);
      promoAnimRef.current = null;
    }
  };

  const handlePromoWheel = (e) => {
    const el = promoSliderRef.current;
    if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY * 0.7;
    }
  };

  const slidePromoManual = (direction) => () => {
    const el = promoSliderRef.current;
    if (!el) return;
    const distance = 460;
    el.scrollBy({ left: direction === 'right' ? distance : -distance, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (promoAnimRef.current) cancelAnimationFrame(promoAnimRef.current);
    };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactBusy(true);
    try {
      await api('/messages', { method: 'POST', body: contactForm });
      setContactSent(true);
      setContactForm({ ...contactForm, subject: 'Question sur un produit', message: '' });
      notify('Message envoyé avec succès ! Notre équipe vous répondra rapidement.');
    } catch (err) {
      notify(err.message);
    } finally {
      setContactBusy(false);
    }
  };

  // Smooth scroll directly to section, positioning it right below the navbar
  const slideTo = (id) => (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('.navbar');
    const navHeight = nav ? nav.offsetHeight : 95;
    const targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    window.history.pushState(null, '', `/#${id}`);
  };

  // Section collections
  const smartphones = useMemo(() => {
    const list = products.filter((p) => p.category === 'Smartphones');
    if (selectedBrand === 'Tous') return list;
    return list.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
  }, [products, selectedBrand]);

  const accessories = useMemo(() => {
    return products.filter((p) => p.category === 'Accessoires');
  }, [products]);

  const promotions = useMemo(() => {
    return products.filter((p) => p.old_price && Number(p.old_price) > Number(p.price));
  }, [products]);

  const displayPromos = useMemo(() => {
    if (!promotions.length) return [];
    // Tripled array for continuous seamless infinite loop sliding
    return [...promotions, ...promotions, ...promotions];
  }, [promotions]);

  return (
    <div className="page home-page">
      {/* 1. SECTION ACCUEIL (HERO BANNER) */}
      <section id="accueil" className="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column */}
            <div className="hero-copy">
              <span className="hero-tag">
                Nouvelle Génération Apple
              </span>
              <h1>Apple iPhone 18 Pro &amp; Haute Performance</h1>
              <p>
                Découvrez en avant-première l'innovation ultime avec le nouvel iPhone 18 Pro en titane bordeaux satiné, triple objectif nouvelle génération et garantie constructeur 1 an partout au Maroc.
              </p>
              <div className="hero-actions">
                <a href="#smartphones" className="btn btn-primary" onClick={slideTo('smartphones')}>
                  Explorer les modèles <ArrowRight size={17} />
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="hero-visual">
              <div className="hero-card-glow"></div>
              <div className="hero-banner-wrap">
                <img
                  src="/iphone-18-pro-hero.jpg"
                  alt="Apple iPhone 18 Pro"
                  className="hero-banner-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERKS / TRUST CARDS */}
      <div className="container">
        <section className="perks">
          <div><span><Truck size={22} /></span><div><b>Livraison rapide</b><small>Partout au Maroc</small></div></div>
          <div><span><ShieldCheck size={22} /></span><div><b>Paiement sécurisé</b><small>100% garanti</small></div></div>
          <div><span><BadgeCheck size={22} /></span><div><b>Produits officiels</b><small>Garantie 1 an</small></div></div>
          <div><span><Headphones size={22} /></span><div><b>Support client</b><small>À votre écoute 24/7</small></div></div>
        </section>

        {/* BRAND & CATEGORY TILES (WITH REALISTIC PHOTOS) */}
        <section className="tiles">
          {BRANDS.map(([label, brand, img]) => (
            <button
              key={brand}
              type="button"
              className="tile"
              onClick={(e) => {
                setSelectedBrand(brand);
                slideTo('smartphones')(e);
              }}
              title={`Voir les modèles ${label}`}
            >
              <div className="tile-art">
                <img src={img} alt={label} className="tile-img" loading="lazy" />
              </div>
              <b>{label}</b>
            </button>
          ))}
          <a
            href="#accessoires"
            className="tile"
            onClick={slideTo('accessoires')}
            title="Voir les accessoires"
          >
            <div className="tile-art">
              <img src="/products/airpods-pro.jpg" alt="Accessoires" className="tile-img" loading="lazy" />
            </div>
            <b>Accessoires</b>
          </a>
          <a
            href="#promotions"
            className="tile tile-promo"
            onClick={slideTo('promotions')}
            title="Voir les promotions"
          >
            <div className="tile-art">
              <img src="/products/promo-badge.jpg" alt="Promotions" className="tile-img promo-img" loading="lazy" />
            </div>
            <b>Promotions</b>
          </a>
        </section>

        {error && (
          <div className="notice error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
            <span>{error}</span>
            <button className="btn btn-light" style={{ padding: '.3rem .8rem', fontSize: '.85rem' }} onClick={loadProducts}>Réessayer</button>
          </div>
        )}
      </div>

      {/* 2. SECTION SMARTPHONES */}
      <section id="smartphones" className="landing-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-pretitle">Nos modèles <span className="text-primary">flagships</span></p>
              <h2 className="section-title">Smartphones &amp; Haute Technologie</h2>
              <p className="section-desc">
                Sélectionnez votre marque favorite et découvrez nos modèles disponibles en stock.
              </p>
            </div>
            <Link to="/smartphones" className="link">Ouvrir avec filtres avancés <ArrowRight size={15} /></Link>
          </div>

          {/* Brand filter buttons */}
          <div className="filter-pills">
            {BRAND_FILTERS.map((b) => (
              <button
                key={b}
                type="button"
                className={`filter-pill ${selectedBrand === b ? 'active' : ''}`}
                onClick={() => setSelectedBrand(b)}
              >
                {b}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="muted">Chargement des smartphones…</p>
          ) : smartphones.length > 0 ? (
            <div className="grid">
              {smartphones.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="empty">Aucun smartphone trouvé pour cette sélection.</p>
          )}
        </div>
      </section>

      {/* 3. SECTION ACCESSOIRES */}
      <section id="accessoires" className="landing-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-pretitle">Écosystème &amp; <span className="text-primary">accessoires</span></p>
              <h2 className="section-title">Équipements &amp; Audio Premium</h2>
              <p className="section-desc">
                Écouteurs sans fil, chargeurs ultra-rapides, coques protectrices et accessoires d'origine.
              </p>
            </div>
            <Link to="/accessoires" className="link">Voir tous les accessoires ({accessories.length}) <ArrowRight size={15} /></Link>
          </div>

          {loading ? (
            <p className="muted">Chargement des accessoires…</p>
          ) : accessories.length > 0 ? (
            <div className="grid grid-4">
              {accessories.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="empty">Aucun accessoire disponible actuellement.</p>
          )}
        </div>
      </section>

      {/* 4. SECTION PROMOTIONS */}
      <section id="promotions" className="landing-section" style={{ paddingBottom: '7.5rem' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '1.35rem' }}>
            <div>
              <p className="section-pretitle">Ventes flash &amp; <span className="text-primary">offres limitées</span></p>
              <h2 className="section-title">Promotions exceptionnelles</h2>
              <p className="section-desc">
                Bénéficiez de réductions immédiates et de prix réduits sur les meilleures références.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div className="promo-nav-buttons">
                <button
                  type="button"
                  className="promo-nav-btn"
                  onClick={slidePromoManual('left')}
                  title="Défiler vers la gauche"
                  aria-label="Promotions précédentes"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="promo-nav-btn"
                  onClick={slidePromoManual('right')}
                  title="Défiler vers la droite"
                  aria-label="Promotions suivantes"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <Link to="/promotions" className="link">Toutes les promotions <ArrowRight size={15} /></Link>
            </div>
          </div>

          {loading ? (
            <p className="muted">Chargement des promotions…</p>
          ) : promotions.length > 0 ? (
            <div className="promo-slider-container">
              <div
                className="promo-slider-track"
                ref={promoSliderRef}
                onMouseEnter={handlePromoMouseMove}
                onMouseMove={handlePromoMouseMove}
                onMouseLeave={stopPromoSlide}
                onWheel={handlePromoWheel}
              >
                {displayPromos.map((p, idx) => {
                  const discount = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
                  const saving = p.old_price ? Math.round(Number(p.old_price) - Number(p.price)) : 0;
                  return (
                    <div
                      key={`${p.id}-${idx}`}
                      className="promo-banner-card"
                      onClick={() => navigate(`/produit/${p.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Top part: Large headline & Offer details */}
                      <div className="promo-card-top">
                        <div className="promo-tags-row">
                          <span className="promo-tag-pill">Offre spéciale</span>
                          {discount > 0 && <span className="promo-tag-discount">-{discount}%</span>}
                        </div>

                        <h3 className="promo-card-title">
                          {p.name}
                        </h3>

                        <div className="promo-pricing-row">
                          <span className="promo-current-price">{money(p.price)}</span>
                          {p.old_price && <s className="promo-strikethrough-price">{money(p.old_price)}</s>}
                          {saving > 0 && <span className="promo-saving-badge">-{money(saving)}</span>}
                        </div>
                      </div>

                      {/* Middle part: Dedicated image showcase (isolated, never touches buttons) */}
                      <div className="promo-card-media" title={p.name}>
                        <img
                          src={resolveProductImage(p)}
                          alt={p.name}
                          className="promo-card-img"
                          loading="lazy"
                          onError={(e) => {
                            const fallback = resolveProductImage(p);
                            if (e.target.src !== fallback) e.target.src = fallback;
                          }}
                        />
                      </div>

                      {/* Bottom part: Action buttons cleanly separated at the bottom */}
                      <div className="promo-card-bottom">
                        <span className="btn btn-primary promo-btn-main">
                          Voir l'offre <ArrowRight size={16} />
                        </span>
                        <button
                          type="button"
                          className="btn btn-light promo-btn-add"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p);
                          }}
                          title="Ajouter directement au panier"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="empty">Toutes nos promotions sont actuellement écoulées.</p>
          )}
        </div>
      </section>

      {/* 5. SECTION CONTACT */}
      <section id="contact" className="landing-section" style={{ paddingTop: '1.25rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '1.2rem' }}>
            <div>
              <p className="section-pretitle" style={{ fontSize: '1.12rem' }}>Support client &amp; <span className="text-primary">assistance</span></p>
              <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', marginBottom: '.3rem' }}>Contactez notre équipe</h2>
              <p className="section-desc" style={{ fontSize: '1.18rem', margin: 0 }}>
                Une question sur un produit, un devis ou votre commande ? Nous sommes à votre écoute.
              </p>
            </div>
          </div>

          <div className="contact" style={{ margin: 0, maxWidth: '100%', gap: '2.25rem', alignItems: 'stretch' }}>
            <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.9rem' }}>
              <div>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '.35rem', color: '#ffffff' }}>Nos coordonnées</h3>
                <p className="muted" style={{ lineHeight: 1.5, fontSize: '1.15rem', margin: 0 }}>
                  Notre équipe d'experts est disponible du lundi au samedi pour vous conseiller et vous accompagner dans votre choix.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <a href="tel:+212612345678" className="ci" style={{ padding: '.55rem .85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}><Phone size={22} /></span>
                  <div>
                    <b style={{ fontSize: '1.22rem', display: 'block', color: '#ffffff', lineHeight: 1.25 }}>+212 6 12 34 56 78</b>
                    <small style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Lundi - Samedi : 9h00 - 19h00</small>
                  </div>
                </a>
                <a href="mailto:contact@expressor.ma" className="ci" style={{ padding: '.55rem .85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}><Mail size={22} /></span>
                  <div>
                    <b style={{ fontSize: '1.22rem', display: 'block', color: '#ffffff', lineHeight: 1.25 }}>contact@expressor.ma</b>
                    <small style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Réponse garantie sous 24h</small>
                  </div>
                </a>
                <a href="https://maps.google.com/?q=Hay+Ngadi+Rue+21+Oujda,Maroc" target="_blank" rel="noreferrer" className="ci" style={{ padding: '.55rem .85rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}><MapPin size={22} /></span>
                  <div>
                    <b style={{ fontSize: '1.22rem', display: 'block', color: '#ffffff', lineHeight: 1.25 }}>Hay Ngadi Rue 21 N° 4, Oujda</b>
                    <small style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Siège social &amp; Retrait express · ICE 003489213000074</small>
                  </div>
                </a>
              </div>

              <div>
                <b style={{ display: 'block', fontSize: '1.12rem', marginBottom: '.5rem', color: '#ffffff' }}>Suivez notre actualité :</b>
                <div className="socials" style={{ marginTop: 0, gap: '.75rem' }}>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Globe size={19} /></a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera size={19} /></a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Play size={19} /></a>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={19} /></a>
                </div>
              </div>
            </div>

            <form className="form-card" onSubmit={handleContactSubmit} style={{ padding: '1.35rem 1.6rem', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.65)' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Envoyez-nous un message</h3>
              {contactSent && (
                <p className="notice ok-box" style={{ fontSize: '1.05rem', padding: '.65rem 1rem', margin: 0 }}>✓ Votre message a bien été envoyé. Notre équipe vous répondra très rapidement.</p>
              )}
              <div className="two" style={{ gap: '0.85rem' }}>
                <div className="field" style={{ gap: '0.35rem' }}>
                  <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Nom complet *</label>
                  <input
                    required
                    style={{ fontSize: '1.05rem', padding: '.65rem .85rem' }}
                    placeholder="Votre nom et prénom"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="field" style={{ gap: '0.35rem' }}>
                  <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Email *</label>
                  <input
                    required
                    type="email"
                    style={{ fontSize: '1.05rem', padding: '.65rem .85rem' }}
                    placeholder="nom@exemple.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="field" style={{ gap: '0.35rem' }}>
                <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Sujet</label>
                <select
                  style={{ fontSize: '1.05rem', padding: '.65rem .85rem' }}
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                >
                  <option>Question sur un produit</option>
                  <option>Suivi de commande</option>
                  <option>Demande de disponibilité</option>
                  <option>Service après-vente &amp; Garantie</option>
                  <option>Autre demande</option>
                </select>
              </div>
              <div className="field" style={{ gap: '0.35rem' }}>
                <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Message *</label>
                <textarea
                  required
                  rows="2"
                  style={{ fontSize: '1.05rem', padding: '.65rem .85rem', minHeight: '68px', maxHeight: '110px', resize: 'vertical' }}
                  placeholder="Décrivez votre demande en détail..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>
              <button className="btn btn-primary full" disabled={contactBusy} style={{ marginTop: '.35rem', fontSize: '1.15rem', fontWeight: 600, padding: '.75rem 1.4rem' }}>
                {contactBusy ? 'Envoi en cours…' : 'Envoyer le message'} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
