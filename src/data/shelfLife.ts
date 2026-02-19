import { ShelfLifeEntry } from './shelfLifeTypes';
import { dairyEntries } from './shelfLifeDairy';
import { meatEntries } from './shelfLifeMeat';
import { produceEntries } from './shelfLifeProduce';
import { staplesEntries } from './shelfLifeStaples';
import { otherEntries } from './shelfLifeOther';

const DB: ShelfLifeEntry[] = [
  ...dairyEntries, ...meatEntries, ...produceEntries,
  ...staplesEntries, ...otherEntries,
];

export const getShelfLifeDays = (
  itemName: string,
  location: 'pantry' | 'fridge' | 'freezer'
): number | null => {
  const name = itemName.toLowerCase().trim();
  let bestMatch: ShelfLifeEntry | null = null;
  let bestLen = 0;

  for (const entry of DB) {
    for (const kw of entry.keywords) {
      if (name.includes(kw) && kw.length > bestLen) {
        bestMatch = entry;
        bestLen = kw.length;
      }
    }
  }

  if (!bestMatch) return null;
  return bestMatch[location] ?? null;
};
