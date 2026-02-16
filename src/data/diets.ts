export interface Diet {
  id: string;
  label: string;
  emoji: string;
  exclude: string[];
  requireCategory?: string[];
}

export const diets: Diet[] = [
  { id: 'keto', label: 'Keto', emoji: '🥑', exclude: ['pasta', 'rice', 'bread', 'flour', 'sugar', 'potato'] },
  { id: 'high-protein', label: 'High Protein', emoji: '💪', exclude: [], requireCategory: ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood', 'Goat'] },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', exclude: ['beef', 'chicken', 'pork', 'lamb', 'goat', 'bacon', 'anchov'] },
  { id: 'vegan', label: 'Vegan', emoji: '🌱', exclude: ['beef', 'chicken', 'pork', 'lamb', 'goat', 'egg', 'milk', 'cream', 'cheese', 'butter', 'honey'] },
  { id: 'paleo', label: 'Paleo', emoji: '🦴', exclude: ['pasta', 'bread', 'rice', 'flour', 'sugar', 'beans', 'lentil', 'peanut', 'soy'] },
  { id: 'low-carb', label: 'Low Carb', emoji: '📉', exclude: ['pasta', 'rice', 'bread', 'potato', 'flour', 'sugar', 'noodle'] },
  { id: 'gluten-free', label: 'Gluten Free', emoji: '🌾', exclude: ['flour', 'bread', 'pasta', 'soy sauce', 'breadcrumb', 'noodle'] },
  { id: 'dairy-free', label: 'Dairy Free', emoji: '🥛', exclude: ['milk', 'cream', 'cheese', 'butter', 'yogurt', 'parmesan'] },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒', exclude: [], requireCategory: ['Seafood', 'Vegetarian', 'Lamb', 'Chicken'] },
  { id: 'whole30', label: 'Whole30', emoji: '🔥', exclude: ['sugar', 'flour', 'bread', 'pasta', 'rice', 'beans', 'cheese', 'milk', 'cream', 'soy'] },
];
