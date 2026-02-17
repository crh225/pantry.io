import React from 'react';
import './PantrySearch.css';

interface Props {
  value: string;
  onChange: (term: string) => void;
}

export const PantrySearch: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="pantry-search">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search your pantry"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};