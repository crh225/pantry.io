import React from 'react';

type Tab = 'cuisine' | 'protein' | 'search';
interface Props { tab: Tab; setTab: (t: Tab) => void; }

export const SearchTabs: React.FC<Props> = ({ tab, setTab }) => (
  <div className="search-tabs">
    <button className={`tab ${tab === 'cuisine' ? 'active' : ''}`} onClick={() => setTab('cuisine')}>
      🌍 Cuisine
    </button>
    <button className={`tab ${tab === 'protein' ? 'active' : ''}`} onClick={() => setTab('protein')}>
      🥩 Protein
    </button>
    <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>
      🔍 Search
    </button>
  </div>
);
