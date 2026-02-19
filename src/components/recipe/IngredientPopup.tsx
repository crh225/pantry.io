import React, { useEffect, useState } from 'react';
import { kroger, KrogerProduct } from '../../services/kroger';

const imgUrl = (name: string) => `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}.png`;

export const IngredientPopup: React.FC<{ name: string }> = ({ name }) => {
  const [product, setProduct] = useState<KrogerProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'added'>('idle');
  useEffect(() => {
    if (!kroger.isConfigured()) return;
    setLoading(true);
    kroger.searchProducts(name).then(r => { setProduct(r[0] || null); setLoading(false); });
  }, [name]);
  const handleAddToCart = async () => {
    if (!product) return;
    setCartState('adding');
    try { await kroger.addToCart(product.upc, 1); setCartState('added'); } catch { setCartState('idle'); }
  };
  return (
    <div className="ing-popup" onClick={e => e.stopPropagation()}>
      <img src={product?.image || imgUrl(name)} alt={name} className="popup-img" onError={e => (e.currentTarget.style.display = 'none')} />
      <div className="popup-info">
        <strong>{product?.description || name}</strong>
        {product?.price?.regular && <span className="popup-price">${product.price.regular.toFixed(2)}</span>}
        {product?.price?.promo && <span className="popup-promo">Sale: ${product.price.promo.toFixed(2)}</span>}
        {product?.size && <span className="popup-size">{product.size}</span>}
        {product?.aisle && <span className="popup-aisle">{product.aisle}</span>}
        {loading && <span className="popup-loading">Looking up price...</span>}
        {product && kroger.isLoggedIn() && cartState === 'idle' && <button className="popup-cart-btn" onClick={handleAddToCart}>+ Add to Kroger Cart</button>}
        {cartState === 'adding' && <span className="popup-loading">Adding...</span>}
        {cartState === 'added' && <span className="popup-cart-added">Added to cart</span>}
      </div>
    </div>
  );
};
