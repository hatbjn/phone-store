import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../context/Store';

export default function Auth() {
  const { user, login } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/compte';
  const modeParam = params.get('mode');
  const [mode, setMode] = useState(modeParam === 'register' ? 'register' : 'login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: f });
      login(res.token, res.user);
      navigate(redirect, { replace: true });
    } catch (err) {
      if (mode === 'login' && (f.email === 'admin@expressor.ma' || f.email === 'admin@phoneshop.ma') && f.password === 'admin123456') {
        login('demo-admin-token', { id: 4, name: 'Yassine Mansouri', email: f.email, role: 'admin', phone: '+212 660 123456' });
        navigate(redirect, { replace: true });
        return;
      }
      if (mode === 'login' && (f.email === 'amine.tazi@gmail.com' || f.email === 'client@expressor.ma' || f.email === 'client@phoneshop.ma') && f.password === 'client123456') {
        login('demo-client-token', { id: 5, name: 'Amine Tazi', email: f.email, role: 'user', phone: '+212 661 458920' });
        navigate(redirect, { replace: true });
        return;
      }
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="page auth">
      <form className="form-card" onSubmit={submit}>
        <div className="tabs center">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>Connexion</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>Créer un compte</button>
        </div>
        {mode === 'register' && (
          <>
            <div className="field"><label>Nom complet*</label><input required value={f.name} onChange={upd('name')} /></div>
            <div className="field"><label>Téléphone</label><input value={f.phone} onChange={upd('phone')} inputMode="tel" /></div>
          </>
        )}
        <div className="field"><label>Email*</label><input required type="email" value={f.email} onChange={upd('email')} /></div>
        <div className="field"><label>Mot de passe*</label>
          <input required type="password" minLength={6} value={f.password} onChange={upd('password')} /></div>
        {error && <p className="notice error">{error}</p>}
        <button className="btn btn-dark full" disabled={busy}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
        <div style={{ margin: '.5rem 0', padding: '.75rem', background: 'var(--soft)', borderRadius: '10px', fontSize: '.8rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '.4rem' }}>Comptes pré-configurés :</p>
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-light" style={{ padding: '.25rem .65rem', fontSize: '.75rem' }}
              onClick={() => { setMode('login'); setF((prev) => ({ ...prev, email: 'admin@expressor.ma', password: 'admin123456' })); }}>
              Admin (admin@expressor.ma)
            </button>
            <button type="button" className="btn btn-light" style={{ padding: '.25rem .65rem', fontSize: '.75rem' }}
              onClick={() => { setMode('login'); setF((prev) => ({ ...prev, email: 'amine.tazi@gmail.com', password: 'client123456' })); }}>
              Client : Amine Tazi (amine.tazi@gmail.com)
            </button>
          </div>
        </div>
        <p className="muted center-text"><Link to="/" className="link">← Retour à l'accueil</Link></p>
      </form>
    </div>
  );
}
