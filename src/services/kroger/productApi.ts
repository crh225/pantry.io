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

/** Extract the main ingredient keyword(s) from the search term */
const extractKeywords = (term: string): string[] => {
  const cleaned = term
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(oz|lb|cup|tbsp|tsp|g|kg|ml|l|pound|ounce|teaspoon|tablespoon)s?\b/gi, '')
    .replace(/\b(large|small|medium|fresh|dried|chopped|diced|minced|sliced|whole|crushed|ground|raw|cooked|to taste|for garnish|optional)\b/gi, '')
    .replace(/[,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.split(' ').filter(w => w.length > 1);
};

/** Score how well a product matches the search keywords using word boundaries */
const scoreMatch = (product: KrogerProduct, keywords: string[]): number => {
  const desc = product.description.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    // Word boundary match: "egg" matches "egg" and "eggs" but not "eggplant"
    const wordBoundary = new RegExp(`\\b${keyword}s?\\b`, 'i');

    if (wordBoundary.test(desc)) {
      // Strong bonus if description starts with the keyword
      if (desc.startsWith(keyword)) score += 100;
      // Whole word match in description
      else score += 40;
    } else if (desc.includes(keyword)) {
      // Substring only (e.g. "eggplant" for "egg") - penalize
      score -= 10;
    }
  }

  // Prefer shorter descriptions (more likely the base ingredient)
  if (desc.split(' ').length <= 3) score += 15;

  return score;
};

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const keywords = extractKeywords(term);
    if (keywords.length === 0) return [];
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const path = `/v1/products?filter.term=${encodeURIComponent(keywords.join(' '))}&filter.limit=15${locParam}`;
    const data = await krogerFetch(path);
    const products = (data?.data || []).map(transformProduct);
    return products
      .map((p: KrogerProduct) => ({ product: p, score: scoreMatch(p, keywords) }))
      .filter((r: { score: number }) => r.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5)
      .map((r: { product: KrogerProduct }) => r.product);
  },
};
