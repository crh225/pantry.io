import React, { useMemo } from 'react';
import { DonutChart } from './DonutChart';
import { MealNight, NutritionInfo } from '../../types';
import './NutritionSummary.css';

interface Props { nights: MealNight[]; }

function aggregateNutrition(nights: MealNight[]): NutritionInfo | null {
  const totals: NutritionInfo = { calories: 0, fat: 0, carbs: 0, protein: 0, fiber: 0 };
  let hasNutrition = false;

  for (const night of nights) {
    const n = night.recipe?.nutrition;
    if (n) {
      hasNutrition = true;
      totals.calories += n.calories;
      totals.fat += (n.fat ?? 0);
      totals.carbs += n.carbs;
      totals.protein += n.protein;
      totals.fiber += n.fiber;
      const sf = n.saturatedFat; if (sf != null) totals.saturatedFat = (totals.saturatedFat ?? 0) + sf;
      const so = n.sodium; if (so != null) totals.sodium = (totals.sodium ?? 0) + so;
    }
  }
  return hasNutrition ? totals : null;
}

function dailyBreakdown(nights: MealNight[]): { id: string; label: string; nutrition: NutritionInfo }[] {
  return nights.map(night => ({
    id: night.id,
    label: night.label,
    nutrition: night.recipe?.nutrition ?? { calories: 0, fat: 0, carbs: 0, protein: 0, fiber: 0 },
  }));
}

const round = (value: number) => Math.round(value * 10) / 10;

export const NutritionSummary: React.FC<Props> = ({ nights }) => {
  const weekly = useMemo(() => aggregateNutrition(nights), [nights]);
  const daily = useMemo(() => dailyBreakdown(nights), [nights]);

  if (!weekly) return null;

  const plannedDays = Math.max(daily.filter(day => day.nutrition.calories > 0).length, 1);
  const dailyCalories = Math.round(weekly.calories / plannedDays);
  const dailyFat = round(weekly.fat / plannedDays);
  const dailyCarbs = round(weekly.carbs / plannedDays);
  const dailyProtein = round(weekly.protein / plannedDays);
  const dailyFiber = round(weekly.fiber / plannedDays);

  const dailyCaloriePercent = Math.min(Math.round((dailyCalories / 2000) * 100), 100);
  const macroCalories = (weekly.protein * 4) + (weekly.carbs * 4) + (weekly.fat * 9);
  const proteinPercent = macroCalories ? Math.round((weekly.protein * 4 / macroCalories) * 100) : 0;
  const carbPercent = macroCalories ? Math.round((weekly.carbs * 4 / macroCalories) * 100) : 0;
  const fatPercent = macroCalories ? Math.round((weekly.fat * 9 / macroCalories) * 100) : 0;

  return (
    <div className="nutrition-summary">
      <div className="nutrition-header">
        <h2>Nutrition Summary</h2>
        <span>{plannedDays} planned {plannedDays === 1 ? 'meal' : 'meals'}</span>
      </div>

      <div className="nutrition-overview">
        <div className="nutrition-chart">
          <div className="calorie-ring">
            <DonutChart percent={dailyCaloriePercent} size={120} />
            <div className="ring-label">Avg Calories/Day</div>
          </div>
          <div className="nutrition-grid">
            <div className="nutri-stat">
              <span className="stat-value">{dailyCalories}</span>
              <span className="stat-label">Calories/day</span>
            </div>
            <div className="nutri-stat">
              <span className="stat-value">{dailyFat}g</span>
              <span className="stat-label">Fat/day</span>
            </div>
            <div className="nutri-stat">
              <span className="stat-value">{dailyCarbs}g</span>
              <span className="stat-label">Carbs/day</span>
            </div>
            <div className="nutri-stat">
              <span className="stat-value">{dailyProtein}g</span>
              <span className="stat-label">Protein/day</span>
            </div>
            <div className="nutri-stat">
              <span className="stat-value">{dailyFiber}g</span>
              <span className="stat-label">Fiber/day</span>
            </div>
            <div className="nutri-stat">
              <span className="stat-value">{Math.round(weekly.calories)}</span>
              <span className="stat-label">Weekly calories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="macro-grid">
        <div className="macro-card">
          <DonutChart percent={proteinPercent} size={64} />
          <span>Protein</span>
          <strong>{Math.round(weekly.protein)}g weekly</strong>
        </div>
        <div className="macro-card">
          <DonutChart percent={carbPercent} size={64} />
          <span>Carbs</span>
          <strong>{Math.round(weekly.carbs)}g weekly</strong>
        </div>
        <div className="macro-card">
          <DonutChart percent={fatPercent} size={64} />
          <span>Fat</span>
          <strong>{Math.round(weekly.fat)}g weekly</strong>
        </div>
      </div>

      <div className="nutrition-daily">
        <h3>Daily Breakdown</h3>
        <div className="daily-grid">
          {daily.map(day => (
            <div className="daily-card" key={day.id}>
              <span className="day-label">{day.label}</span>
              <span className="day-cal">{day.nutrition.calories || '—'} kcal</span>
              {day.nutrition.protein > 0 && (
                <div className="day-macros">
                  <span>P {day.nutrition.protein}g</span>
                  <span>C {day.nutrition.carbs}g</span>
                  <span>F {day.nutrition.fat}g</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
