import { Ingredient } from '../types';

const PREP_WORDS = [
  'chopped', 'minced', 'diced', 'sliced', 'grated', 'crushed', 'peeled',
  'deveined', 'julienned', 'shredded', 'melted', 'softened', 'cubed',
  'halved', 'quartered', 'divided', 'crumbled', 'torn', 'beaten', 'whisked',
  'room temperature', 'at room temperature', 'warmed', 'chilled', 'frozen',
  'thawed', 'rinsed', 'drained', 'patted dry', 'trimmed', 'cored', 'seeded',
  'deseeded', 'pitted', 'zested', 'juiced', 'separated', 'sifted',
  'to taste', 'for garnish', 'for serving', 'as needed', 'optional',
  'finely', 'coarsely', 'freshly', 'thinly', 'roughly', 'lightly',
  'fresh', 'dried', 'ground', 'whole', 'raw', 'cooked',
  'large', 'small', 'medium', 'extra', 'thick', 'thin',
  'boneless', 'skinless', 'bone-in', 'skin-on',
  'packed', 'loosely packed', 'firmly packed',
];
const PREP_PATTERN = new RegExp(
  `(,?\\s*\\b(${PREP_WORDS.join('|')})\\b\\s*)+`, 'gi'
);
const COMPOUND_SEASONING = /^salt\s+and\s+pepper/i;

const SKIP_ITEMS = new Set([
  'salt', 'pepper', 'black pepper', 'white pepper', 'water', 'ice',
  'cooking spray', 'salt and pepper', 'salt and pepper to taste',
  'kosher salt', 'sea salt',
]);

export const cleanName = (name: string): string => {
  let n = name.trim();
  if (COMPOUND_SEASONING.test(n)) return '';
  n = n.replace(PREP_PATTERN, ' ');
  n = n.replace(/\s+/g, ' ').replace(/^[,\s]+|[,\s]+$/g, '').trim();
  return n;
};

export const dedup = (bag: Ingredient[]): Ingredient[] => {
  const map = new Map<string, Ingredient>();
  bag.forEach(i => {
    const cleaned = cleanName(i.name);
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (SKIP_ITEMS.has(key)) return;
    if (!map.has(key)) map.set(key, { ...i, name: cleaned });
  });
  return Array.from(map.values());
};
