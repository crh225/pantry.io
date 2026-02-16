import { KrogerConfig, KrogerProduct } from './types';
import { krogerFetch } from './proxy';

const transformProduct = (item: any): KrogerProduct => ({
  productId: item.productId,
  upc: item.upc || '',
  description: item.description || '',
  brand: item.brand || '',
  price: item.items?.[0]?.price ? {
    regular: item.items[0].price.regular,
    promo: item.items[0].price.promo || undefined,
  } : null,
  image: item.images?.find((i: any) => i.perspective === 'front')
    ?.sizes?.find((s: any) => s.size === 'medium')?.url || '',
  aisle: item.aisleLocations?.[0]?.description || '',
  size: item.items?.[0]?.size || '',
});

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const path = `/v1/products?filter.term=${encodeURIComponent(term)}&filter.limit=5${locParam}`;
    const data = await krogerFetch(path);
    return (data?.data || []).map(transformProduct);
  },
};
