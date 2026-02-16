import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { buildShareUrl } from '../../utils/shareLink';
import './SharePantry.css';

export const SharePantry: React.FC = () => {
  const { items } = useAppSelector(s => s.pantry);
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const handleShare = async () => {
    const url = buildShareUrl(items);
    if (navigator.share) {
      try { await navigator.share({ title: 'My Pantry', url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="share-btn" onClick={handleShare}>
      {copied ? '✓ Link copied!' : '🔗 Share Pantry'}
    </button>
  );
};
