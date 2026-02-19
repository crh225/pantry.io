import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="recipe-card skeleton-card">
    <div className="skeleton-image" />
    <div className="recipe-info">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-meta" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC = () => (
  <div className="recipe-list">
    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);
