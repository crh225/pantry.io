import React, { useState, useRef } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { searchRecipes, searchByCategory, searchByArea } from '../../store/slices/recipeThunks';
import { SearchTabs } from './SearchTabs';
import { CollapsedBar } from './CollapsedBar';
import { SearchBody } from './SearchBody';
import { sanitizeInput } from '../../utils/validation';
import './RecipeSearch.css';

export const RecipeSearch: React.FC = () => {
  const [tab, setTab] = useState<'cuisine' | 'protein' | 'search'>('cuisine');
  const [collapsed, setCollapsed] = useState(false);
  const [activeLabel, setActiveLabel] = useState('');
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = () => {
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCuisineClick = (cuisine: string) => {
    dispatch(searchByArea(cuisine));
    setActiveLabel(cuisine); setCollapsed(true); scrollToResults();
  };
  const handleCategoryClick = (category: string) => {
    dispatch(searchByCategory(category));
    setActiveLabel(category); setCollapsed(true); scrollToResults();
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim().length < 2) return;
    dispatch(searchRecipes(sanitizeInput(searchText)));
    setCollapsed(true); setActiveLabel(searchText); scrollToResults();
  };
  const handleExpand = () => { setCollapsed(false); setActiveLabel(''); };

  return (
    <div className="recipe-search">
      <SearchTabs tab={tab} setTab={(t) => { setTab(t); setCollapsed(false); setActiveLabel(''); }} />
      {collapsed ? (
        <CollapsedBar label={activeLabel} onExpand={handleExpand} />
      ) : (
        <SearchBody tab={tab} searchText={searchText} setSearchText={setSearchText}
          onCuisine={handleCuisineClick} onCategory={handleCategoryClick} onSearch={handleSearch} />
      )}
      <div ref={resultsRef} />
    </div>
  );
};
