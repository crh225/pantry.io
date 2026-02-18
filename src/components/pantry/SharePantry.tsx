import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import './SharePantry.css';

type Expiry = '1d' | '7d';

export const SharePantry: React.FC = () => {
  const { items } = useAppSelector(s => s.pantry);
  const [showPopup, setShowPopup] = useState(false);
  const [expiry, setExpiry] = useState<Expiry>('7d');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  if (items.length === 0) return null;

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, expiresIn: expiry }),
      });
      const data = await res.json();
      if (!data.id) throw new Error('Failed');
      setShareUrl(`${window.location.origin}?s=${data.id}`);
    } catch {
      alert('Failed to create share link.');
    }
    setCreating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPopup = () => {
    setShowPopup(true);
    setShareUrl('');
    setCopied(false);
  };

  return (
    <>
      <button className="share-btn" onClick={openPopup}>Share Pantry</button>
      {showPopup && (
        <div className="share-overlay" onClick={() => setShowPopup(false)}>
          <div className="share-popup" onClick={e => e.stopPropagation()}>
            <button className="share-popup-close" onClick={() => setShowPopup(false)}>×</button>
            <h3>Share Your Pantry</h3>
            {!shareUrl ? (
              <>
                <p className="share-desc">Create a shareable link to your pantry list.</p>
                <div className="share-expiry-row">
                  <span>Link expires in:</span>
                  <div className="share-expiry-toggle">
                    <button className={`expiry-opt ${expiry === '1d' ? 'active' : ''}`}
                      onClick={() => setExpiry('1d')}>1 Day</button>
                    <button className={`expiry-opt ${expiry === '7d' ? 'active' : ''}`}
                      onClick={() => setExpiry('7d')}>7 Days</button>
                  </div>
                </div>
                <button className="share-create-btn" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Link'}
                </button>
              </>
            ) : (
              <>
                <div className="share-url-box">
                  <input type="text" readOnly value={shareUrl} className="share-url-input" />
                  <button className="share-copy-btn" onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="share-expiry-note">Expires in {expiry === '1d' ? '1 day' : '7 days'}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
