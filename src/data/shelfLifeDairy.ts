import { ShelfLifeEntry } from './shelfLifeTypes';

export const dairyEntries: ShelfLifeEntry[] = [
  { keywords: ['milk', 'whole milk', 'skim milk', '2% milk'], fridge: 7, freezer: 90 },
  { keywords: ['butter', 'unsalted butter', 'salted butter'], fridge: 30, freezer: 120 },
  { keywords: ['cream cheese'], fridge: 14, freezer: 60 },
  { keywords: ['sour cream'], fridge: 14 },
  { keywords: ['yogurt', 'greek yogurt'], fridge: 14, freezer: 60 },
  { keywords: ['heavy cream', 'whipping cream'], fridge: 10 },
  { keywords: ['cheese', 'cheddar', 'mozzarella', 'swiss', 'provolone', 'colby'], fridge: 28, freezer: 180 },
  { keywords: ['parmesan', 'hard cheese'], fridge: 60, freezer: 180 },
  { keywords: ['egg', 'eggs'], fridge: 35, freezer: 365 },
];
