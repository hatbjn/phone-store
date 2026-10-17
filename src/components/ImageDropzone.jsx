import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, Link2 } from 'lucide-react';
import { api } from '../api';

export default function ImageDropzone({ value, onChange, label = 'Image de l\'article' }) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez déposer un fichier image (PNG, JPG, WEBP...).');
      return;
    }
    setError('');
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        // Upload to backend to get local static URL
        const res = await api('/upload', {
          method: 'POST',
          body: { data: base64, filename: file.name },
        });
        onChange(res.url);
      } catch {
        // Fallback: save the base64 data URL directly
        onChange(reader.result);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label>{label}</label>
        <button
          type="button"
          className="link"
          style={{ fontSize: '0.78rem' }}
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          {showUrlInput ? 'Glisser-déposer une image' : 'Ou entrer une URL'}
        </button>
      </div>

      {showUrlInput ? (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--line)'}`,
            borderRadius: '12px',
            padding: value ? '1rem' : '1.8rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(153, 227, 158, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
            }}
          />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)' }}>
              <Loader2 className="spin" size={28} />
              <span style={{ fontSize: '0.85rem' }}>Téléversement de l'image…</span>
            </div>
          ) : value ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--line)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <img
                  src={value}
                  alt="Aperçu"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <b style={{ display: 'block', fontSize: '0.88rem', color: '#ffffff' }}>Image sélectionnée</b>
                <small style={{ color: 'var(--muted)', wordBreak: 'break-all' }}>{value.slice(0, 50)}{value.length > 50 ? '…' : ''}</small>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-light"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', height: '32px' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Changer l'image
                  </button>
                  <button
                    type="button"
                    className="btn btn-light danger-text"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', height: '32px' }}
                    onClick={() => onChange('')}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(153, 227, 158, 0.12)',
                  border: '1px solid rgba(153, 227, 158, 0.25)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 0 15px rgba(153, 227, 158, 0.15)',
                  color: dragOver ? 'var(--primary)' : 'var(--primary)',
                  marginBottom: '0.2rem',
                }}
              >
                <Upload size={20} />
              </div>
              <b style={{ color: '#ffffff', fontSize: '0.92rem' }}>
                Glissez-déposez une image ici
              </b>
              <span style={{ fontSize: '0.82rem' }}>ou cliquez pour parcourir vos fichiers</span>
              <small style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>PNG, JPG, WEBP, SVG</small>
            </div>
          )}
        </div>
      )}
      {error && <p className="err" style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>{error}</p>}
    </div>
  );
}
