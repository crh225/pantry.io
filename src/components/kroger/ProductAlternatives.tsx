import React, { useState, useEffect } from 'react';
import { kroger, KrogerProduct } from '../../services/kroger';
import './ProductAlternatives.css';

interface Props {
  ingredientName: string;
  currentProduct: KrogerProduct;
  onSelectAlternative: (product: KrogerProduct) => void;
}

export const ProductAlternatives: React.FC<Props> = ({
  ingredientName,
  currentProduct,
  onSelectAlternative
}) => {
  const [expanded, setExpanded] = useState(false);
  const [alternatives, setAlternatives] = useState<KrogerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded) return;

    setLoading(true);
    setError(null);
    kroger.searchProducts(ingredientName).then(results => {
      // Filter out current product and take top 3 alternatives (ensure price.regular exists)
      const alts = results
        .filter((p: KrogerProduct) => p.upc !== currentProduct.upc && p.price?.regular)
        .slice(0, 3);
      setAlternatives(alts);
      setLoading(false);
    }).catch((e: any) => {
      setError(e.message || 'Failed to load alternatives');
      setLoading(false);
    });
  }, [expanded, ingredientName, currentProduct.upc]);

  return (
    <div className="product-alternatives">
      <button
        className="alternatives-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? '\u2212 less' : '+ swap'}
      </button>

      {expanded && (
        <div className="alternatives-list">
          {loading && <div className="alternatives-loading">Loading...</div>}
          {error && <div className="alternatives-error">{error}</div>}
          {!loading && !error && alternatives.length === 0 && (
            <div className="alternatives-empty">No alternatives found</div>
          )}
          {!loading && alternatives.map(alt => (
            <button
              key={alt.upc}
              className="alternative-item"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAlternative(alt);
                setExpanded(false);
              }}
            >
              {alt.image && <img src={alt.image} alt="" className="alt-thumb" />}
              <div className="alt-info">
                <span className="alt-description">{alt.description}</span>
                {alt.size && <span className="alt-size">{alt.size}</span>}
              </div>
              <div className="alt-price">
                <span>${alt.price?.regular.toFixed(2)}</span>
                {alt.price?.promo && (
                  <span className="alt-promo">Sale ${alt.price.promo.toFixed(2)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
