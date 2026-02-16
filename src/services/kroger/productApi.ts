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

/** Extract the main ingredient keyword (e.g., "onion" from "1 large white onion, diced") */
const extractKeyword = (term: string): string => {
  // Remove measurements, numbers, and common modifiers
  const cleaned = term
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(oz|lb|cup|tbsp|tsp|g|kg|ml|l|pound|ounce|teaspoon|tablespoon)s?\b/gi, '')
    .replace(/\b(large|small|medium|fresh|dried|chopped|diced|minced|sliced|whole|crushed|ground|raw|cooked)\b/gi, '')
    .replace(/[,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Take just the last meaningful word (usually the ingredient)
  const words = cleaned.split(' ').filter(w => w.length > 2);
  return words[words.length - 1] || term;
};

/** Score how well a product matches the search term */
const scoreMatch = (product: KrogerProduct, keyword: string): number => {
  const desc = product.description.toLowerCase();
  const kw = keyword.toLowerCase();
  if (desc.startsWith(kw)) return 100;
  if (desc.includes(` ${kw} `) || desc.includes(` ${kw}s `)) return 80;
  if (desc.includes(kw)) return 50;
  return 0;
};

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const keyword = extractKeyword(term);
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const path = `/v1/products?filter.term=${encodeURIComponent(keyword)}&filter.limit=10${locParam}`;
    const data = await krogerFetch(path);
    const products = (data?.data || []).map(transformProduct);
    // Sort by relevance to the ingredient keyword
    return products.sort((a: KrogerProduct, b: KrogerProduct) => scoreMatch(b, keyword) - scoreMatch(a, keyword)).slice(0, 5);
  },
};
