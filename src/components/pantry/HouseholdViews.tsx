import React from 'react';
import { getHouseholdCode } from '../../store/slices/pantryHelpers';

export const LinkedContent: React.FC<{ onUnlink: () => void }> = ({ onUnlink }) => (
  <>
    <h3>Devices Linked</h3>
    <p className="share-desc">
      Your pantry and meal plan are syncing with another device.
    </p>
    <div className="household-linked-code">Code: {getHouseholdCode()}</div>
    <button className="household-unlink-btn" onClick={onUnlink}>
      Unlink This Device
    </button>
  </>
);

export const CodeContent: React.FC<{
  code: string; copied: boolean; onCopy: () => void;
}> = ({ code, copied, onCopy }) => (
  <>
    <h3>Your Household Code</h3>
    <p className="share-desc">Enter this code on the other device to link up.</p>
    <div className="household-code-display">{code}</div>
    <button className="share-create-btn" onClick={onCopy}>
      {copied ? 'Copied!' : 'Copy Code'}
    </button>
  </>
);

export const JoinContent: React.FC<{
  error: string; loading: boolean; joinInput: string;
  onSetJoinInput: (v: string) => void; onJoin: () => void;
}> = ({ error, loading, joinInput, onSetJoinInput, onJoin }) => (
  <>
    <h3>Join Household</h3>
    <p className="share-desc">Enter the code from the other device.</p>
    {error && <p className="share-error">{error}</p>}
    <input
      type="text"
      className="household-code-input"
      placeholder="ABC123"
      value={joinInput}
      onChange={e => onSetJoinInput(e.target.value.toUpperCase())}
      maxLength={6}
      autoFocus
    />
    <button className="share-create-btn" onClick={onJoin} disabled={loading}>
      {loading ? 'Joining...' : 'Join'}
    </button>
  </>
);
