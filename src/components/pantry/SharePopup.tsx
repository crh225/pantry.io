import React from 'react';

type Expiry = '1d' | '7d';

interface Props {
  expiry: Expiry; setExpiry: (v: Expiry) => void;
  shareUrl: string; error: string; creating: boolean; copied: boolean;
  onCreate: () => void; onCopy: () => void; onClose: () => void;
}

export const SharePopup: React.FC<Props> = ({ expiry, setExpiry, shareUrl, error, creating, copied, onCreate, onCopy, onClose }) => (
  <div className="share-overlay" onClick={onClose}>
    <div className="share-popup" onClick={e => e.stopPropagation()}>
      <button className="share-popup-close" onClick={onClose}>×</button>
      <h3>Share Your Pantry</h3>
      {!shareUrl ? (
        <>
          <p className="share-desc">Create a shareable link to your pantry list.</p>
          <div className="share-expiry-row">
            <span>Link expires in:</span>
            <div className="share-expiry-toggle">
              <button className={`expiry-opt ${expiry === '1d' ? 'active' : ''}`} onClick={() => setExpiry('1d')}>1 Day</button>
              <button className={`expiry-opt ${expiry === '7d' ? 'active' : ''}`} onClick={() => setExpiry('7d')}>7 Days</button>
            </div>
          </div>
          {error && <p className="share-error">{error}</p>}
          <button className="share-create-btn" onClick={onCreate} disabled={creating}>
            {creating ? 'Creating...' : 'Create Link'}
          </button>
        </>
      ) : (
        <>
          <div className="share-url-box">
            <input type="text" readOnly value={shareUrl} className="share-url-input" />
            <button className="share-copy-btn" onClick={onCopy}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
          <p className="share-expiry-note">Expires in {expiry === '1d' ? '1 day' : '7 days'}</p>
        </>
      )}
    </div>
  </div>
);
