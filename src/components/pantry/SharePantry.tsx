import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { getHouseholdCode } from '../../store/slices/pantryHelpers';
import { useHouseholdActions } from '../../hooks/useHouseholdActions';
import { SharePopup } from './SharePopup';
import './SharePantry.css';
import './HouseholdLink.css';

type Expiry = '1d' | '7d';

export const SharePantry: React.FC = () => {
  const { items } = useAppSelector(s => s.pantry);
  const [showPopup, setShowPopup] = useState(false);
  const [expiry, setExpiry] = useState<Expiry>('7d');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Household state
  const linked = !!getHouseholdCode();
  const [code, setCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const close = () => setShowPopup(false);
  const actions = useHouseholdActions(close);

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
  const handleCreateCode = async () => { const r = await actions.createCode(); if (r) setCode(r); };
  const handleJoin = async () => { const r = await actions.joinHousehold(joinInput); if (r) setCode(r); };
  const handleCopyCode = async () => { await navigator.clipboard.writeText(code); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  const openPopup = () => { setShowPopup(true); setShareUrl(''); setCopied(false); setError(''); setCode(''); setJoinInput(''); };

  return (
    <>
      <button className="share-btn" onClick={openPopup}>
        {linked ? 'Share / Linked' : 'Share Pantry'}
      </button>
      {showPopup && (
        <SharePopup
          expiry={expiry} setExpiry={setExpiry} shareUrl={shareUrl} error={error}
          creating={creating} copied={copied} onCreate={handleCreate} onCopy={handleCopy}
          linked={linked} code={code} linkError={actions.error} linkLoading={actions.loading}
          linkCopied={linkCopied} joinInput={joinInput} onSetJoinInput={setJoinInput}
          onCreateCode={handleCreateCode} onJoin={handleJoin} onUnlink={actions.unlink}
          onCopyCode={handleCopyCode} onClose={close}
        />
      )}
    </>
  );
};
