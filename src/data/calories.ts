// Rough per-serving calorie estimates by common ingredients
const calorieMap: Record<string, number> = {
  beef: 250, chicken: 165, pork: 210, lamb: 250, goat: 140,
  salmon: 200, tuna: 130, shrimp: 85, fish: 130, seafood: 130,
  rice: 130, pasta: 160, noodle: 160, bread: 80, flour: 60,
  potato: 110, egg: 70, cheese: 110, butter: 100, cream: 90,
  milk: 60, oil: 120, sugar: 50, honey: 60, lentil: 115,
  beans: 120, chickpea: 130, tofu: 80, mushroom: 25,
  onion: 20, garlic: 5, tomato: 20, pepper: 15, carrot: 25,
  broccoli: 30, spinach: 10, lettuce: 5, avocado: 120,
  coconut: 100, lemon: 10, lime: 10, ginger: 5, salt: 0,
};

export const estimateCalories = (ingredients: { name: string; measure: string }[]): number | null => {
  let total = 0;
  let matched = 0;
  for (const ing of ingredients) {
    const name = ing.name.toLowerCase();
    const key = Object.keys(calorieMap).find(k => name.includes(k));
    if (key) { total += calorieMap[key]; matched++; }
  }
  return matched >= 2 ? Math.round(total) : null;
};
