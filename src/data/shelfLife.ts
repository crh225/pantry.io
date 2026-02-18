// Typical shelf life in days by storage location
// Sources: USDA FoodKeeper, FDA guidelines
interface ShelfLifeEntry {
  keywords: string[];
  pantry?: number;
  fridge?: number;
  freezer?: number;
}

const DB: ShelfLifeEntry[] = [
  // Dairy
  { keywords: ['milk', 'whole milk', 'skim milk', '2% milk'], fridge: 7, freezer: 90 },
  { keywords: ['butter', 'unsalted butter', 'salted butter'], fridge: 30, freezer: 120 },
  { keywords: ['cream cheese'], fridge: 14, freezer: 60 },
  { keywords: ['sour cream'], fridge: 14 },
  { keywords: ['yogurt', 'greek yogurt'], fridge: 14, freezer: 60 },
  { keywords: ['heavy cream', 'whipping cream'], fridge: 10 },
  { keywords: ['cheese', 'cheddar', 'mozzarella', 'swiss', 'provolone', 'colby'], fridge: 28, freezer: 180 },
  { keywords: ['parmesan', 'hard cheese'], fridge: 60, freezer: 180 },
  { keywords: ['egg', 'eggs'], fridge: 35, freezer: 365 },

  // Meat & Poultry (raw)
  { keywords: ['chicken', 'chicken breast', 'chicken thigh', 'chicken leg', 'chicken wing'], fridge: 2, freezer: 270 },
  { keywords: ['ground beef', 'ground turkey', 'ground pork', 'ground meat'], fridge: 2, freezer: 120 },
  { keywords: ['steak', 'beef steak', 'ribeye', 'sirloin', 'filet'], fridge: 4, freezer: 180 },
  { keywords: ['pork chop', 'pork loin', 'pork tenderloin'], fridge: 4, freezer: 180 },
  { keywords: ['bacon'], fridge: 7, freezer: 30 },
  { keywords: ['sausage', 'italian sausage', 'breakfast sausage'], fridge: 2, freezer: 60 },
  { keywords: ['ham', 'deli ham'], fridge: 5, freezer: 60 },
  { keywords: ['turkey', 'turkey breast'], fridge: 2, freezer: 270 },
  { keywords: ['lamb', 'lamb chop'], fridge: 4, freezer: 180 },
  { keywords: ['hot dog', 'hot dogs', 'frankfurter'], fridge: 7, freezer: 60 },
  { keywords: ['deli meat', 'lunch meat', 'cold cuts', 'salami', 'pepperoni'], fridge: 5, freezer: 60 },

  // Seafood
  { keywords: ['fish', 'salmon', 'tilapia', 'cod', 'tuna steak', 'halibut', 'trout', 'mahi'], fridge: 2, freezer: 180 },
  { keywords: ['shrimp', 'prawns'], fridge: 2, freezer: 180 },
  { keywords: ['crab', 'lobster', 'scallop', 'clam', 'mussel', 'oyster'], fridge: 2, freezer: 90 },

  // Produce - Fruits
  { keywords: ['apple', 'apples'], pantry: 7, fridge: 28 },
  { keywords: ['banana', 'bananas'], pantry: 5, fridge: 7 },
  { keywords: ['orange', 'oranges', 'clementine', 'mandarin', 'tangerine'], pantry: 7, fridge: 21 },
  { keywords: ['strawberry', 'strawberries'], fridge: 5, freezer: 180 },
  { keywords: ['blueberry', 'blueberries', 'raspberry', 'raspberries', 'blackberry'], fridge: 5, freezer: 180 },
  { keywords: ['grape', 'grapes'], fridge: 10 },
  { keywords: ['lemon', 'lemons', 'lime', 'limes'], fridge: 21 },
  { keywords: ['avocado'], pantry: 4, fridge: 5 },
  { keywords: ['peach', 'nectarine', 'plum'], pantry: 4, fridge: 5 },
  { keywords: ['watermelon', 'cantaloupe', 'honeydew', 'melon'], fridge: 5 },
  { keywords: ['pineapple'], fridge: 5 },
  { keywords: ['mango'], pantry: 5, fridge: 7 },

  // Produce - Vegetables
  { keywords: ['lettuce', 'romaine', 'mixed greens', 'salad mix', 'arugula'], fridge: 5 },
  { keywords: ['spinach', 'kale', 'collard greens', 'swiss chard'], fridge: 5, freezer: 300 },
  { keywords: ['tomato', 'tomatoes'], pantry: 5, fridge: 7 },
  { keywords: ['cucumber', 'cucumbers'], fridge: 7 },
  { keywords: ['bell pepper', 'pepper', 'peppers'], fridge: 7, freezer: 180 },
  { keywords: ['carrot', 'carrots'], fridge: 21, freezer: 300 },
  { keywords: ['celery'], fridge: 14 },
  { keywords: ['broccoli'], fridge: 5, freezer: 300 },
  { keywords: ['cauliflower'], fridge: 7, freezer: 300 },
  { keywords: ['corn', 'corn on the cob'], fridge: 3, freezer: 240 },
  { keywords: ['green beans', 'snap beans'], fridge: 5, freezer: 240 },
  { keywords: ['mushroom', 'mushrooms'], fridge: 7 },
  { keywords: ['zucchini', 'squash', 'yellow squash'], fridge: 7, freezer: 180 },
  { keywords: ['onion', 'onions', 'yellow onion', 'red onion', 'white onion'], pantry: 30, fridge: 14 },
  { keywords: ['garlic'], pantry: 60, fridge: 14 },
  { keywords: ['potato', 'potatoes', 'russet', 'yukon'], pantry: 21 },
  { keywords: ['sweet potato', 'sweet potatoes', 'yam'], pantry: 21 },
  { keywords: ['cabbage'], fridge: 14 },
  { keywords: ['asparagus'], fridge: 4 },
  { keywords: ['green onion', 'scallion', 'scallions'], fridge: 7 },
  { keywords: ['herb', 'cilantro', 'parsley', 'basil', 'dill', 'mint', 'rosemary', 'thyme'], fridge: 7 },
  { keywords: ['ginger', 'fresh ginger'], fridge: 21, freezer: 180 },
  { keywords: ['jalapeno', 'serrano', 'habanero', 'chili pepper'], fridge: 14 },

  // Bread & Baked
  { keywords: ['bread', 'white bread', 'wheat bread', 'sourdough'], pantry: 7, fridge: 14, freezer: 90 },
  { keywords: ['tortilla', 'tortillas', 'wrap', 'wraps'], pantry: 7, fridge: 21, freezer: 180 },
  { keywords: ['bagel', 'bagels', 'english muffin'], pantry: 5, freezer: 90 },
  { keywords: ['bun', 'buns', 'roll', 'rolls', 'hamburger bun'], pantry: 5, freezer: 90 },
  { keywords: ['pita', 'naan', 'flatbread'], pantry: 5, fridge: 14, freezer: 90 },
  { keywords: ['croissant', 'pastry', 'danish', 'muffin'], pantry: 3, freezer: 90 },
  { keywords: ['cake'], fridge: 5, freezer: 120 },
  { keywords: ['pie'], fridge: 4, freezer: 120 },

  // Condiments & Sauces
  { keywords: ['ketchup'], pantry: 365, fridge: 180 },
  { keywords: ['mustard'], pantry: 365, fridge: 365 },
  { keywords: ['mayonnaise', 'mayo'], fridge: 60 },
  { keywords: ['salsa'], fridge: 14 },
  { keywords: ['soy sauce'], pantry: 730 },
  { keywords: ['hot sauce', 'sriracha', 'tabasco'], pantry: 365 },
  { keywords: ['worcestershire'], pantry: 365 },
  { keywords: ['bbq sauce', 'barbecue sauce'], pantry: 365, fridge: 120 },
  { keywords: ['salad dressing', 'ranch', 'vinaigrette'], fridge: 60 },
  { keywords: ['jam', 'jelly', 'preserves', 'marmalade'], pantry: 365, fridge: 90 },
  { keywords: ['peanut butter', 'almond butter'], pantry: 90 },
  { keywords: ['honey'], pantry: 730 },
  { keywords: ['maple syrup'], pantry: 365, fridge: 365 },
  { keywords: ['olive oil', 'vegetable oil', 'canola oil', 'coconut oil', 'cooking oil'], pantry: 365 },
  { keywords: ['vinegar', 'apple cider vinegar', 'balsamic vinegar', 'white vinegar', 'red wine vinegar'], pantry: 730 },
  { keywords: ['tomato sauce', 'marinara', 'pasta sauce', 'tomato paste'], pantry: 365, fridge: 7 },

  // Canned & Dry Goods
  { keywords: ['canned beans', 'canned tomato', 'canned corn', 'canned soup', 'canned tuna', 'canned chicken'], pantry: 730 },
  { keywords: ['pasta', 'spaghetti', 'penne', 'linguine', 'fettuccine', 'macaroni', 'noodles'], pantry: 730 },
  { keywords: ['rice', 'white rice', 'brown rice', 'basmati', 'jasmine rice'], pantry: 730 },
  { keywords: ['flour', 'all-purpose flour', 'bread flour', 'wheat flour'], pantry: 240 },
  { keywords: ['sugar', 'granulated sugar', 'brown sugar', 'powdered sugar'], pantry: 730 },
  { keywords: ['cereal', 'oatmeal', 'oats', 'granola'], pantry: 180 },
  { keywords: ['crackers', 'cracker'], pantry: 180 },
  { keywords: ['chips', 'potato chips', 'tortilla chips'], pantry: 60 },
  { keywords: ['nuts', 'almonds', 'walnuts', 'pecans', 'cashews', 'peanuts'], pantry: 90, freezer: 365 },

  // Frozen Foods
  { keywords: ['frozen pizza'], freezer: 180 },
  { keywords: ['frozen vegetables', 'frozen peas', 'frozen corn', 'frozen broccoli'], freezer: 300 },
  { keywords: ['frozen fruit', 'frozen berries', 'frozen mango'], freezer: 300 },
  { keywords: ['ice cream', 'gelato', 'sorbet'], freezer: 60 },
  { keywords: ['frozen fries', 'french fries', 'tater tots'], freezer: 240 },
  { keywords: ['frozen chicken', 'frozen fish', 'frozen shrimp'], freezer: 180 },
  { keywords: ['frozen dinner', 'frozen meal', 'tv dinner'], freezer: 120 },
  { keywords: ['frozen waffle', 'frozen pancake'], freezer: 120 },

  // Beverages
  { keywords: ['juice', 'orange juice', 'apple juice', 'grape juice', 'cranberry juice'], fridge: 10 },
  { keywords: ['almond milk', 'oat milk', 'soy milk', 'coconut milk'], fridge: 10 },
  { keywords: ['coffee', 'ground coffee', 'coffee beans'], pantry: 180 },
  { keywords: ['tea', 'tea bags'], pantry: 365 },

  // Leftovers & Prepared
  { keywords: ['leftovers', 'leftover', 'cooked'], fridge: 4, freezer: 90 },
  { keywords: ['soup', 'stew', 'chili'], fridge: 4, freezer: 120 },
  { keywords: ['hummus', 'guacamole', 'dip'], fridge: 7 },
  { keywords: ['tofu', 'tempeh'], fridge: 7, freezer: 150 },
];

export const getShelfLifeDays = (
  itemName: string,
  location: 'pantry' | 'fridge' | 'freezer'
): number | null => {
  const name = itemName.toLowerCase().trim();

  // Try exact/substring match — longest keyword match wins
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
