import { useState, useEffect } from 'react';
import { mealPlanService } from '../services/supabase';
import type { MealPlan } from '../types';

export function useMealPlan() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const plans = await mealPlanService.getByDateRange(
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
      setMealPlans(plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Essenpläne');
    } finally {
      setLoading(false);
    }
  };

  const getMealPlansByDateRange = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const plans = await mealPlanService.getByDateRange(startDate, endDate);
      setMealPlans(plans);
      return plans;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Essenpläne');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (plan: Omit<MealPlan, 'id' | 'created_at' | 'user_id'>) => {
    setError(null);
    try {
      const newPlan = await mealPlanService.create(plan);
      setMealPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Erstellen des Essenplans';
      setError(message);
      throw new Error(message);
    }
  };

  const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
    setError(null);
    try {
      const updated = await mealPlanService.update(id, updates);
      setMealPlans((prev) => prev.map((plan) => (plan.id === id ? updated : plan)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Essenplans';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteMealPlan = async (id: string) => {
    setError(null);
    try {
      await mealPlanService.delete(id);
      setMealPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Löschen des Essenplans';
      setError(message);
      throw new Error(message);
    }
  };

  const generateShoppingListFromPlans = (planIds: string[]) => {
    const selectedPlans = mealPlans.filter((plan) => planIds.includes(plan.id));
    const ingredients: Record<string, { quantity: number; unit: string }> = {};

    selectedPlans.forEach((plan) => {
      if (plan.recipe && plan.recipe.ingredients) {
        plan.recipe.ingredients.forEach((ingredient) => {
          const key = ingredient.name.toLowerCase();
          if (ingredients[key]) {
            // Sum up quantities (assuming same unit)
            ingredients[key].quantity += ingredient.quantity;
          } else {
            ingredients[key] = {
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            };
          }
        });
      }
    });

    return Object.entries(ingredients).map(([name, { quantity, unit }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      quantity,
      unit,
      checked: false,
    }));
  };

  return {
    mealPlans,
    loading,
    error,
    fetchMealPlans,
    getMealPlansByDateRange,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
    generateShoppingListFromPlans,
  };
}
