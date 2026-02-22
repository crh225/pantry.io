import React, { useState } from 'react';
import { getHouseholdCode } from '../../store/slices/pantryHelpers';
import { useHouseholdActions } from '../../hooks/useHouseholdActions';
import { HouseholdPopup } from './HouseholdPopup';
import './HouseholdLink.css';

export const HouseholdLink: React.FC = () => {
  const linked = !!getHouseholdCode();
  const [showPopup, setShowPopup] = useState(false);
  const [view, setView] = useState<'menu' | 'code' | 'join'>('menu');
  const [code, setCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [copied, setCopied] = useState(false);
  const close = () => setShowPopup(false);
  const actions = useHouseholdActions(close);
  const open = () => { setShowPopup(true); setView('menu'); setCode(''); setJoinInput(''); };

  const handleCreate = async () => {
    const result = await actions.createCode();
    if (result) { setCode(result); setView('code'); }
  };
  const handleJoin = async () => {
    const result = await actions.joinHousehold(joinInput);
    if (result) { setCode(result); setView('code'); }
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button className="household-btn" onClick={open}>
        {linked ? 'Linked' : 'Link Devices'}
      </button>
      {showPopup && (
        <HouseholdPopup
          view={view} linked={linked} code={code}
          error={actions.error} loading={actions.loading}
          copied={copied} joinInput={joinInput}
          onSetView={setView} onSetJoinInput={setJoinInput}
          onCreate={handleCreate} onJoin={handleJoin}
          onUnlink={actions.unlink} onCopy={handleCopy}
          onClose={close}
        />
      )}
    </>
  );
};
