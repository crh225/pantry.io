export interface CommonItem {
  name: string;
  defaultQuantity: string;
  category: string;
}

export const commonPantryItems: CommonItem[] = [
  { name: 'Rice', defaultQuantity: '1 bag', category: 'Grains' },
  { name: 'Pasta', defaultQuantity: '1 box', category: 'Grains' },
  { name: 'Flour', defaultQuantity: '1 bag', category: 'Baking' },
  { name: 'Sugar', defaultQuantity: '1 bag', category: 'Baking' },
  { name: 'Salt', defaultQuantity: '1 container', category: 'Spices' },
  { name: 'Pepper', defaultQuantity: '1 container', category: 'Spices' },
  { name: 'Olive Oil', defaultQuantity: '1 bottle', category: 'Oils' },
  { name: 'Vegetable Oil', defaultQuantity: '1 bottle', category: 'Oils' },
  { name: 'Canned Tomatoes', defaultQuantity: '2 cans', category: 'Canned' },
  { name: 'Chicken Broth', defaultQuantity: '2 boxes', category: 'Canned' },
  { name: 'Beans', defaultQuantity: '2 cans', category: 'Canned' },
  { name: 'Garlic', defaultQuantity: '1 bulb', category: 'Produce' },
  { name: 'Onions', defaultQuantity: '3', category: 'Produce' },
  { name: 'Potatoes', defaultQuantity: '5 lbs', category: 'Produce' },
];

export const commonFridgeItems: CommonItem[] = [
  { name: 'Milk', defaultQuantity: '1 gallon', category: 'Dairy' },
  { name: 'Eggs', defaultQuantity: '1 dozen', category: 'Dairy' },
  { name: 'Butter', defaultQuantity: '1 stick', category: 'Dairy' },
  { name: 'Cheese', defaultQuantity: '1 block', category: 'Dairy' },
  { name: 'Yogurt', defaultQuantity: '4 cups', category: 'Dairy' },
  { name: 'Carrots', defaultQuantity: '1 lb', category: 'Produce' },
  { name: 'Lettuce', defaultQuantity: '1 head', category: 'Produce' },
  { name: 'Tomatoes', defaultQuantity: '4', category: 'Produce' },
  { name: 'Bell Peppers', defaultQuantity: '2', category: 'Produce' },
  { name: 'Lemon', defaultQuantity: '2', category: 'Produce' },
];

export const commonFreezerItems: CommonItem[] = [
  { name: 'Chicken Breast', defaultQuantity: '2 lbs', category: 'Meat' },
  { name: 'Ground Beef', defaultQuantity: '1 lb', category: 'Meat' },
  { name: 'Frozen Vegetables', defaultQuantity: '2 bags', category: 'Frozen' },
  { name: 'Frozen Berries', defaultQuantity: '1 bag', category: 'Frozen' },
  { name: 'Ice Cream', defaultQuantity: '1 pint', category: 'Frozen' },
  { name: 'Bread', defaultQuantity: '1 loaf', category: 'Frozen' },
];
