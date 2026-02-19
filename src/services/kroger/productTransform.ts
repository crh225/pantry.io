import { KrogerProduct } from './types';

export const transformProduct = (item: any): KrogerProduct & { inStock: boolean } => {
  const itemData = item.items?.[0];
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

export const extractKeywords = (term: string): string[] => {
  const cleaned = term
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(oz|lb|cup|tbsp|tsp|g|kg|ml|l|pound|ounce|teaspoon|tablespoon)s?\b/gi, '')
    .replace(/\b(large|small|medium|fresh|dried|chopped|diced|minced|sliced|whole|crushed|ground|raw|cooked|to taste|for garnish|optional)\b/gi, '')
    .replace(/[,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.split(' ').filter(w => w.length > 1);
};
