import React from 'react';
import { CuisinePicker } from './CuisinePicker';

type Tab = 'cuisine' | 'protein' | 'search';
interface Props {
  tab: Tab;
  searchText: string;
  setSearchText: (v: string) => void;
  onCuisine: (v: string) => void;
  onCategory: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const SearchBody: React.FC<Props> = ({
  tab, searchText, setSearchText, onCuisine, onCategory, onSearch,
}) => (
  <>
    {tab === 'cuisine' && <CuisinePicker type="cuisine" onSelect={onCuisine} />}
    {tab === 'protein' && <CuisinePicker type="protein" onSelect={onCategory} />}
    {tab === 'search' && (
      <form className="text-search" onSubmit={onSearch}>
        <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
          placeholder="Search recipes by name..." className="search-input" maxLength={100} />
        <button type="submit" className="search-btn">Search</button>
      </form>
    )}
  </>
);
