import { KrogerConfig, KrogerProduct } from './types';
import { getToken } from './auth';

const BASE = 'https://api.kroger.com/v1';

const transformProduct = (item: any): KrogerProduct => ({
  productId: item.productId,
  upc: item.upc || '',
  description: item.description || '',
  brand: item.brand || '',
  price: item.items?.[0]?.price ? {
    regular: item.items[0].price.regular,
    promo: item.items[0].price.promo || undefined,
  } : null,
  image: item.images?.find((i: any) => i.perspective === 'front')?.sizes?.find((s: any) => s.size === 'medium')?.url || '',
  aisle: item.aisleLocations?.[0]?.description || '',
  size: item.items?.[0]?.size || '',
});

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const token = await getToken(config);
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const res = await fetch(`${BASE}/products?filter.term=${encodeURIComponent(term)}&filter.limit=5${locParam}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map(transformProduct);
  },
};
