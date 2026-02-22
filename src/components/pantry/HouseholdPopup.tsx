import React from 'react';
import { LinkedContent, CodeContent, JoinContent } from './HouseholdViews';

interface Props {
  view: 'menu' | 'code' | 'join';
  linked: boolean;
  code: string;
  error: string;
  loading: boolean;
  copied: boolean;
  joinInput: string;
  onSetView: (v: 'menu' | 'code' | 'join') => void;
  onSetJoinInput: (v: string) => void;
  onCreate: () => void;
  onJoin: () => void;
  onUnlink: () => void;
  onCopy: () => void;
  onClose: () => void;
}

export const HouseholdPopup: React.FC<Props> = (p) => (
  <div className="share-overlay" onClick={p.onClose}>
    <div className="share-popup" onClick={e => e.stopPropagation()}>
      <button className="share-popup-close" onClick={p.onClose}>&times;</button>

      {p.view === 'menu' && !p.linked && (
        <>
          <h3>Link Devices</h3>
          <p className="share-desc">Share your pantry and meal plan with another device.</p>
          {p.error && <p className="share-error">{p.error}</p>}
          <div className="household-actions">
            <button className="share-create-btn" onClick={p.onCreate} disabled={p.loading}>
              {p.loading ? 'Creating...' : 'Create a Code'}
            </button>
            <button className="household-join-btn" onClick={() => p.onSetView('join')}>
              Join with a Code
            </button>
          </div>
        </>
      )}

      {p.view === 'menu' && p.linked && <LinkedContent onUnlink={p.onUnlink} />}
      {p.view === 'code' && <CodeContent code={p.code} copied={p.copied} onCopy={p.onCopy} />}
      {p.view === 'join' && (
        <JoinContent
          error={p.error} loading={p.loading} joinInput={p.joinInput}
          onSetJoinInput={p.onSetJoinInput} onJoin={p.onJoin}
        />
      )}
    </div>
  </div>
);
