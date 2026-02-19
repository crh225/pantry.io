import { ShelfLifeEntry } from './shelfLifeTypes';

export const otherEntries: ShelfLifeEntry[] = [
  { keywords: ['frozen pizza'], freezer: 180 },
  { keywords: ['frozen vegetables', 'frozen peas', 'frozen corn', 'frozen broccoli'], freezer: 300 },
  { keywords: ['frozen fruit', 'frozen berries', 'frozen mango'], freezer: 300 },
  { keywords: ['ice cream', 'gelato', 'sorbet'], freezer: 60 },
  { keywords: ['frozen fries', 'french fries', 'tater tots'], freezer: 240 },
  { keywords: ['frozen chicken', 'frozen fish', 'frozen shrimp'], freezer: 180 },
  { keywords: ['frozen dinner', 'frozen meal', 'tv dinner'], freezer: 120 },
  { keywords: ['frozen waffle', 'frozen pancake'], freezer: 120 },
  { keywords: ['juice', 'orange juice', 'apple juice', 'grape juice', 'cranberry juice'], fridge: 10 },
  { keywords: ['almond milk', 'oat milk', 'soy milk', 'coconut milk'], fridge: 10 },
  { keywords: ['coffee', 'ground coffee', 'coffee beans'], pantry: 180 },
  { keywords: ['tea', 'tea bags'], pantry: 365 },
  { keywords: ['leftovers', 'leftover', 'cooked'], fridge: 4, freezer: 90 },
  { keywords: ['soup', 'stew', 'chili'], fridge: 4, freezer: 120 },
  { keywords: ['hummus', 'guacamole', 'dip'], fridge: 7 },
  { keywords: ['tofu', 'tempeh'], fridge: 7, freezer: 150 },
];
