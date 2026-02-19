import { KrogerProduct } from './types';

const PROCESSED_INDICATORS = [
  'pickled', 'pickles', 'pickle', 'sauce', 'dressing', 'seasoning', 'mix',
  'flavored', 'spread', 'dip', 'chips', 'crackers', 'bread', 'pasta',
  'frozen', 'canned', 'dried', 'powder', 'extract', 'syrup', 'jam', 'jelly',
  'juice', 'drink', 'soda', 'candy', 'snack', 'cookie', 'cake', 'pie',
  'soup', 'stew', 'meal', 'dinner', 'lunch', 'breakfast', 'kit', 'prepared'
];

export const scoreMatch = (product: KrogerProduct, keywords: string[]): number => {
  const desc = product.description.toLowerCase();
  const descWords = desc.split(/\s+/);
  let score = 0;

  for (const keyword of keywords) {
    const wordBoundary = new RegExp(`\\b${keyword}s?\\b`, 'i');
    if (wordBoundary.test(desc)) {
      score += desc.startsWith(keyword) ? 100 : 40;
    } else if (desc.includes(keyword)) {
      score -= 10;
    }
  }

  for (const indicator of PROCESSED_INDICATORS) {
    if (descWords.includes(indicator)) { score -= 30; break; }
  }

  const extraWords = descWords.filter(w =>
    w.length > 2 && !keywords.some(k => w.includes(k) || k.includes(w))
  ).length;
  if (extraWords > 2) score -= extraWords * 5;
  if (descWords.length <= 3) score += 15;
  if (product.price?.promo) score += 20;

  return score;
};
