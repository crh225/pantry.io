import json, urllib.request

# TheMealDB - 40 recipes
mealdb_ids = list(range(52771, 52815)) + list(range(52815, 52830))
print("=== TheMealDB INSTRUCTION FORMATS ===\n")
patterns = {"single_block": 0, "numbered": 0, "newline_sep": 0, "double_newline": 0, "has_step_label": 0, "short": 0}

for mid in mealdb_ids[:40]:
    try:
        url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={mid}"
        data = json.loads(urllib.request.urlopen(url, timeout=5).read())
        if not data.get("meals"): continue
        meal = data["meals"][0]
        instr = meal["strInstructions"]
        name = meal["strMeal"]
        
        has_double = "\r\n\r\n" in instr or "\n\n" in instr
        has_single = "\r\n" in instr or "\n" in instr
        has_numbered = any(instr.find(f"{i})") >= 0 for i in range(1,10))
        has_step = "STEP " in instr.upper() or "Step " in instr
        lines = [l.strip() for l in instr.replace("\r\n", "\n").split("\n") if l.strip()]
        
        if has_step: patterns["has_step_label"] += 1
        if has_double: patterns["double_newline"] += 1
        elif has_numbered: patterns["numbered"] += 1
        elif has_single: patterns["newline_sep"] += 1
        else: patterns["single_block"] += 1
        if len(lines) <= 2: patterns["short"] += 1
        
        print(f"[{mid}] {name}")
        print(f"  Lines: {len(lines)} | double_nl: {has_double} | numbered: {has_numbered} | step_label: {has_step}")
        print(f"  First 150: {repr(instr[:150])}")
        
        # Check ingredients
        ings = []
        for i in range(1, 21):
            ing = meal.get(f"strIngredient{i}", "").strip()
            meas = meal.get(f"strMeasure{i}", "").strip()
            if ing: ings.append(f"{meas} {ing}")
        print(f"  Ingredients ({len(ings)}): {ings[:5]}...")
        print()
    except Exception as e:
        pass

print(f"\nPATTERNS: {patterns}")

# DummyJSON - 10 recipes
print("\n=== DummyJSON INSTRUCTION FORMATS ===\n")
data = json.loads(urllib.request.urlopen("https://dummyjson.com/recipes?limit=10", timeout=5).read())
for r in data["recipes"]:
    print(f"[dj-{r['id']}] {r['name']}")
    print(f"  Steps: {len(r['instructions'])} | Type: list")
    print(f"  First 2: {r['instructions'][:2]}")
    print(f"  Ingredients ({len(r['ingredients'])}): {r['ingredients'][:5]}")
    print(f"  Rating: {r.get('rating')} | Reviews: {r.get('reviewCount')} | Cal: {r.get('caloriesPerServing')}")
    print()
