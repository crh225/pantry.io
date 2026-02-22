import React, { useState } from 'react';
import { LinkedContent, CodeContent, JoinContent } from './HouseholdViews';

type Expiry = '1d' | '7d';
type Tab = 'share' | 'link';

interface ShareProps {
  expiry: Expiry; setExpiry: (v: Expiry) => void;
  shareUrl: string; error: string; creating: boolean; copied: boolean;
  onCreate: () => void; onCopy: () => void;
}

interface LinkProps {
  linked: boolean; code: string; linkError: string;
  linkLoading: boolean; linkCopied: boolean; joinInput: string;
  onSetJoinInput: (v: string) => void;
  onCreateCode: () => void; onJoin: () => void;
  onUnlink: () => void; onCopyCode: () => void;
}

type Props = ShareProps & LinkProps & { onClose: () => void };

export const SharePopup: React.FC<Props> = (p) => {
  const [tab, setTab] = useState<Tab>('share');
  const [linkView, setLinkView] = useState<'menu' | 'code' | 'join'>('menu');

  const handleCreate = () => { p.onCreateCode(); setLinkView('code'); };

  return (
    <div className="share-overlay" onClick={p.onClose}>
      <div className="share-popup" onClick={e => e.stopPropagation()}>
        <button className="share-popup-close" onClick={p.onClose}>×</button>
        <div className="share-tabs">
          <button className={`share-tab${tab === 'share' ? ' active' : ''}`} onClick={() => setTab('share')}>Share Link</button>
          <button className={`share-tab${tab === 'link' ? ' active' : ''}`} onClick={() => { setTab('link'); setLinkView('menu'); }}>
            Link Devices {p.linked && <span className="share-tab-dot" />}
          </button>
        </div>

        {tab === 'share' && !p.shareUrl && (
          <>
            <p className="share-desc">Create a shareable link to your pantry list.</p>
            <div className="share-expiry-row">
              <span>Link expires in:</span>
              <div className="share-expiry-toggle">
                <button className={`expiry-opt ${p.expiry === '1d' ? 'active' : ''}`} onClick={() => p.setExpiry('1d')}>1 Day</button>
                <button className={`expiry-opt ${p.expiry === '7d' ? 'active' : ''}`} onClick={() => p.setExpiry('7d')}>7 Days</button>
              </div>
            </div>
            {p.error && <p className="share-error">{p.error}</p>}
            <button className="share-create-btn" onClick={p.onCreate} disabled={p.creating}>
              {p.creating ? 'Creating...' : 'Create Link'}
            </button>
          </>
        )}

        {tab === 'share' && p.shareUrl && (
          <>
            <div className="share-url-box">
              <input type="text" readOnly value={p.shareUrl} className="share-url-input" />
              <button className="share-copy-btn" onClick={p.onCopy}>{p.copied ? '✓ Copied' : 'Copy'}</button>
            </div>
            <p className="share-expiry-note">Expires in {p.expiry === '1d' ? '1 day' : '7 days'}</p>
          </>
        )}

        {tab === 'link' && linkView === 'menu' && !p.linked && (
          <>
            <p className="share-desc">Sync your pantry and meal plan across devices in real-time.</p>
            {p.linkError && <p className="share-error">{p.linkError}</p>}
            <div className="household-actions">
              <button className="share-create-btn" onClick={handleCreate} disabled={p.linkLoading}>
                {p.linkLoading ? 'Creating...' : 'Create a Code'}
              </button>
              <button className="household-join-btn" onClick={() => setLinkView('join')}>Join with a Code</button>
            </div>
          </>
        )}

        {tab === 'link' && linkView === 'menu' && p.linked && <LinkedContent onUnlink={p.onUnlink} />}
        {tab === 'link' && linkView === 'code' && p.code && <CodeContent code={p.code} copied={p.linkCopied} onCopy={p.onCopyCode} />}
        {tab === 'link' && linkView === 'join' && (
          <JoinContent error={p.linkError} loading={p.linkLoading} joinInput={p.joinInput}
            onSetJoinInput={p.onSetJoinInput} onJoin={p.onJoin} />
        )}
      </div>
    </div>
  );
};
