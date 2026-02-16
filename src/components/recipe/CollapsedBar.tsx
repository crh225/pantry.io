import React from 'react';

interface Props { label: string; onExpand: () => void; }

export const CollapsedBar: React.FC<Props> = ({ label, onExpand }) => (
  <div className="collapsed-bar" onClick={onExpand}>
    <span className="collapsed-label">Showing: <strong>{label}</strong></span>
    <span className="collapsed-change">Change ▾</span>
  </div>
);
