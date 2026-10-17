import { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Camera, Play, Music2, Send } from 'lucide-react';
import { api } from '../api';
import { useStore } from '../context/Store';

export default function Contact() {
  const { notify, user } = useStore();
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', subject: 'Question sur un produit', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/messages', { method: 'POST', body: f });
      setSent(true);
      setF({ ...f, subject: 'Question sur un produit', message: '' });
      notify('Message envoyé, merci !');
    } catch (err) { notify(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="page contact" style={{ maxWidth: 1200, margin: '0 auto', gap: '2.5rem' }}>
      <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.1rem, 3.2vw, 2.75rem)', fontWeight: 700, marginBottom: '.4rem', color: '#ffffff' }}>Contactez notre équipe</h1>
          <p className="muted" style={{ lineHeight: 1.5, fontSize: '1.18rem', margin: 0 }}>
            Une question sur un produit, un devis ou votre commande ? Nous sommes à votre écoute du lundi au samedi.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <a href="tel:+212612345678" className="ci" style={{ padding: '.65rem .95rem', borderRadius: '12px' }}>
            <span style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}><Phone size={22} /></span>
            <div>
              <b style={{ fontSize: '1.22rem', display: 'block', color: '#ffffff', lineHeight: 1.25 }}>+212 6 12 34 56 78</b>
              <small style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Lundi - Samedi : 9h00 - 19h00</small>
            </div>
          </a>
          <a href="mailto:contact@expressor.ma" className="ci" style={{ padding: '.65rem .95rem', borderRadius: '12px' }}>
            <span style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}><Mail size={22} /></span>
            <div>
              <b style={{ fontSize: '1.22rem', display: 'block', color: '#ffffff', lineHeight: 1.25 }}>contact@expressor.ma</b>
              <small style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Réponse garantie sous 24h</small>
            </div>
          </a>
          <a href="https://maps.google.com/?q=Hay+Ngadi+Rue+21+Oujda,Maroc" target="_blank" rel="noreferrer" className="ci" style={{ padding: '.65rem .95rem', borderRadius: '12px' }}>
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

      <form className="form-card" onSubmit={submit} style={{ padding: '1.5rem 1.8rem', gap: '0.85rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Envoyez-nous un message</h2>
        {sent && <p className="notice ok-box" style={{ fontSize: '1.05rem', margin: 0 }}>✓ Votre message a bien été envoyé. Nous vous répondrons rapidement.</p>}
        <div className="two" style={{ gap: '0.85rem' }}>
          <div className="field" style={{ gap: '0.35rem' }}>
            <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Nom complet *</label>
            <input required style={{ fontSize: '1.05rem', padding: '.7rem .85rem' }} placeholder="Votre nom et prénom" value={f.name} onChange={upd('name')} />
          </div>
          <div className="field" style={{ gap: '0.35rem' }}>
            <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Email *</label>
            <input required type="email" style={{ fontSize: '1.05rem', padding: '.7rem .85rem' }} placeholder="nom@exemple.com" value={f.email} onChange={upd('email')} />
          </div>
        </div>
        <div className="field" style={{ gap: '0.35rem' }}>
          <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Sujet</label>
          <select value={f.subject} onChange={upd('subject')} required style={{ fontSize: '1.05rem', padding: '.7rem .85rem' }}>
            <option>Question sur un produit</option>
            <option>Suivi de commande</option>
            <option>Demande de disponibilité</option>
            <option>Service après-vente &amp; Garantie</option>
            <option>Autre demande</option>
          </select>
        </div>
        <div className="field" style={{ gap: '0.35rem' }}>
          <label style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0' }}>Message *</label>
          <textarea required rows="3" style={{ fontSize: '1.05rem', padding: '.7rem .85rem', minHeight: '80px', maxHeight: '120px', resize: 'vertical' }} placeholder="Décrivez votre demande en détail..." value={f.message} onChange={upd('message')} />
        </div>
        <button className="btn btn-primary full" disabled={busy} style={{ marginTop: '.35rem', fontSize: '1.15rem', fontWeight: 600, padding: '.8rem 1.4rem' }}>
          {busy ? 'Envoi en cours…' : 'Envoyer le message'} <Send size={18} />
        </button>
      </form>
    </div>
  );
}
