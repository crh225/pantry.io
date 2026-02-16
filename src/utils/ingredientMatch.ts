// Ingredients everyone has — never count as "missing"
const UNIVERSAL = new Set([
  'water', 'ice', 'salt', 'pepper', 'black pepper', 'white pepper',
  'cooking spray', 'non-stick spray', 'tap water', 'warm water',
  'cold water', 'boiling water', 'hot water',
]);

// If you have the key ingredient, you have all the derived forms
const DERIVED: Record<string, string[]> = {
  egg: ['egg wash', 'egg yolk', 'egg white', 'beaten egg', 'eggs'],
  butter: ['melted butter', 'unsalted butter', 'salted butter', 'butter'],
  milk: ['whole milk', 'milk', 'buttermilk'],
  flour: ['plain flour', 'all-purpose flour', 'self-raising flour', 'flour'],
  sugar: ['white sugar', 'granulated sugar', 'caster sugar', 'sugar'],
  oil: ['vegetable oil', 'canola oil', 'cooking oil', 'sunflower oil', 'oil'],
  'olive oil': ['extra virgin olive oil', 'olive oil'],
  garlic: ['garlic clove', 'garlic cloves', 'minced garlic', 'garlic powder', 'garlic'],
  onion: ['onion', 'onions', 'yellow onion', 'white onion', 'red onion'],
  chicken: ['chicken breast', 'chicken thigh', 'chicken leg', 'chicken thighs'],
  cream: ['heavy cream', 'double cream', 'whipping cream', 'single cream', 'sour cream'],
  cheese: ['cheddar', 'mozzarella', 'parmesan', 'cheddar cheese'],
  rice: ['white rice', 'basmati rice', 'long grain rice', 'jasmine rice'],
  tomato: ['tomatoes', 'cherry tomatoes', 'tomato paste', 'tomato sauce', 'chopped tomatoes'],
  lemon: ['lemon juice', 'lemon zest', 'lemon'],
  lime: ['lime juice', 'lime zest', 'lime'],
  soy: ['soy sauce', 'light soy sauce', 'dark soy sauce'],
  stock: ['chicken stock', 'beef stock', 'vegetable stock', 'broth', 'chicken broth', 'beef broth'],
  bouillon: ['stock', 'broth', 'chicken stock', 'beef stock'],
};

export const isIngredientAvailable = (ingredientName: string, pantryNames: string[]): boolean => {
  const ing = ingredientName.toLowerCase().trim();
  if (UNIVERSAL.has(ing)) return true;
  // Direct match
  if (pantryNames.some(p => ing.includes(p) || p.includes(ing))) return true;
  // Derived match: if pantry has base, derived counts
  for (const [base, forms] of Object.entries(DERIVED)) {
    if (forms.some(f => ing.includes(f) || f.includes(ing))) {
      if (pantryNames.some(p => p.includes(base) || base.includes(p))) return true;
    }
  }
  return false;
};
