import { KrogerConfig, KrogerProduct } from './types';
import { krogerFetch } from './proxy';

const transformProduct = (item: any): KrogerProduct & { inStock: boolean } => {
  const itemData = item.items?.[0];
  // Check inventory status - consider in stock if not explicitly out of stock
  const stockLevel = itemData?.inventory?.stockLevel || '';
  const inStock = stockLevel !== 'TEMPORARILY_OUT_OF_STOCK' && stockLevel !== 'OUT_OF_STOCK';

  return {
    productId: item.productId,
    upc: item.upc || '',
    description: item.description || '',
    brand: item.brand || '',
    price: itemData?.price ? {
      regular: itemData.price.regular,
      promo: itemData.price.promo || undefined,
    } : null,
    image: item.images?.find((i: any) => i.perspective === 'front')
      ?.sizes?.find((s: any) => s.size === 'medium')?.url || '',
    aisle: item.aisleLocations?.[0]?.description || '',
    size: itemData?.size || '',
    inStock,
  };
};

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

// Words that indicate a processed/prepared product - penalize these when searching for base ingredients
const PROCESSED_INDICATORS = [
  'pickled', 'pickles', 'pickle', 'sauce', 'dressing', 'seasoning', 'mix',
  'flavored', 'spread', 'dip', 'chips', 'crackers', 'bread', 'pasta',
  'frozen', 'canned', 'dried', 'powder', 'extract', 'syrup', 'jam', 'jelly',
  'juice', 'drink', 'soda', 'candy', 'snack', 'cookie', 'cake', 'pie',
  'soup', 'stew', 'meal', 'dinner', 'lunch', 'breakfast', 'kit', 'prepared'
];

/** Score how well a product matches the search keywords using word boundaries */
const scoreMatch = (product: KrogerProduct, keywords: string[]): number => {
  const desc = product.description.toLowerCase();
  const descWords = desc.split(/\s+/);
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

  // Penalize processed/prepared products when searching for base ingredients
  for (const indicator of PROCESSED_INDICATORS) {
    if (descWords.includes(indicator)) {
      score -= 30;
      break; // Only penalize once
    }
  }

  // Penalize products with many extra words not in search (likely wrong product)
  const extraWords = descWords.filter(w =>
    w.length > 2 && !keywords.some(k => w.includes(k) || k.includes(w))
  ).length;
  if (extraWords > 2) score -= extraWords * 5;

  // Prefer shorter descriptions (more likely the base ingredient)
  if (descWords.length <= 3) score += 15;

  // Boost items on sale
  if (product.price?.promo) score += 20;

  return score;
};

export const krogerProductApi = {
  search: async (term: string, config: KrogerConfig): Promise<KrogerProduct[]> => {
    const keywords = extractKeywords(term);
    if (keywords.length === 0) return [];
    const locParam = config.locationId ? `&filter.locationId=${config.locationId}` : '';
    const path = `/v1/products?filter.term=${encodeURIComponent(keywords.join(' '))}&filter.limit=20${locParam}`;
    const data = await krogerFetch(path);
    const products = (data?.data || []).map(transformProduct);
    return products
      // Only include in-stock items with prices
      .filter((p: KrogerProduct & { inStock: boolean }) => p.inStock && p.price)
      .map((p: KrogerProduct) => ({ product: p, score: scoreMatch(p, keywords) }))
      .filter((r: { score: number }) => r.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 5)
      .map((r: { product: KrogerProduct }) => r.product);
  },
};
