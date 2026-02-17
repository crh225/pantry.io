import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './PantrySearch.css';

interface Props {
  value: string;
  onChange: (term: string) => void;
}

export const PantrySearch: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="pantry-search">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search your pantry"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};