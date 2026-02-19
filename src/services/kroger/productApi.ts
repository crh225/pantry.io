import { KrogerConfig, KrogerProduct } from './types';
import { krogerFetch } from './proxy';
import { transformProduct, extractKeywords } from './productTransform';
import { scoreMatch } from './productScoring';

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const keywords = extractKeywords(term);
    if (keywords.length === 0) return [];
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const path = `/v1/products?filter.term=${encodeURIComponent(keywords.join(' '))}&filter.limit=20${locParam}`;
    const data = await krogerFetch(path);
    const products = (data?.data || []).map(transformProduct);
    return products
      .filter((p: KrogerProduct & { inStock: boolean }) => p.inStock && p.price)
      .map((p: KrogerProduct) => ({ product: p, score: scoreMatch(p, keywords) }))
      .filter((r: { score: number }) => r.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5)
      .map((r: { product: KrogerProduct }) => r.product);
  },
};
