import React, { useState, useEffect } from 'react';
import { kroger, KrogerProduct } from '../../services/kroger';
import { AlternativeItem } from './AlternativeItem';
import './ProductAlternatives.css';

interface Props {
  ingredientName: string;
  currentProduct: KrogerProduct;
  onSelectAlternative: (product: KrogerProduct) => void;
}

export const ProductAlternatives: React.FC<Props> = ({ ingredientName, currentProduct, onSelectAlternative }) => {
  const [expanded, setExpanded] = useState(false);
  const [alternatives, setAlternatives] = useState<KrogerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded) return;
    setLoading(true); setError(null);
    kroger.searchProducts(ingredientName).then(results => {
      setAlternatives(results.filter((p: KrogerProduct) => p.upc !== currentProduct.upc && p.price?.regular).slice(0, 3));
      setLoading(false);
    }).catch((e: any) => { setError(e.message || 'Failed to load alternatives'); setLoading(false); });
  }, [expanded, ingredientName, currentProduct.upc]);

  return (
    <div className="product-alternatives">
      <button className="alternatives-toggle" onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}>
        {expanded ? '\u2212 less' : '+ swap'}
      </button>
      {expanded && (
        <div className="alternatives-list">
          {loading && <div className="alternatives-loading">Loading...</div>}
          {error && <div className="alternatives-error">{error}</div>}
          {!loading && !error && alternatives.length === 0 && <div className="alternatives-empty">No alternatives found</div>}
          {!loading && alternatives.map(alt => (
            <AlternativeItem key={alt.upc} alt={alt} onSelect={() => { onSelectAlternative(alt); setExpanded(false); }} />
          ))}
        </div>
      )}
    </div>
  );
};
