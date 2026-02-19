import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { SharePopup } from './SharePopup';
import './SharePantry.css';

type Expiry = '1d' | '7d';

export const SharePantry: React.FC = () => {
  const { items } = useAppSelector(s => s.pantry);
  const [showPopup, setShowPopup] = useState(false);
  const [expiry, setExpiry] = useState<Expiry>('7d');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) return null;

  const handleCreate = async () => {
    setCreating(true); setError('');
    try {
      const res = await fetch('/api/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, expiresIn: expiry }) });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || `Server returned ${res.status}`);
      setShareUrl(`${window.location.origin}?s=${data.id}`);
    } catch (e: any) { setError(e.message || 'Failed to create share link.'); }
    setCreating(false);
  };

  const handleCopy = async () => { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const openPopup = () => { setShowPopup(true); setShareUrl(''); setCopied(false); setError(''); };

  return (
    <>
      <button className="share-btn" onClick={openPopup}>Share Pantry</button>
      {showPopup && <SharePopup expiry={expiry} setExpiry={setExpiry} shareUrl={shareUrl} error={error}
        creating={creating} copied={copied} onCreate={handleCreate} onCopy={handleCopy} onClose={() => setShowPopup(false)} />}
    </>
  );
};
