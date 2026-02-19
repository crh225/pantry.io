import React from 'react';
import { KrogerStore, KrogerProfile } from '../../services/kroger';

interface Props {
  isAuthenticated: boolean;
  selectedStore: KrogerStore | null;
  profile: KrogerProfile | null;
  onClick: () => void;
}

export const KrogerBadge: React.FC<Props> = ({ isAuthenticated, selectedStore, profile, onClick }) => (
  <div className="header-kroger">
    <button className={`store-badge ${isAuthenticated ? 'connected' : ''}`} onClick={onClick}>
      <svg className="store-badge-icon" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span className="store-badge-name">
        {selectedStore ? selectedStore.name.replace(/^[^-]+-\s*/, '') : 'Set Store'}
        {isAuthenticated && profile?.firstName && ` • Hi, ${profile.firstName}`}
      </span>
      {isAuthenticated && <span className="connection-indicator" />}
    </button>
  </div>
);
