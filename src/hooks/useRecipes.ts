import { useState, useEffect } from 'react';
import { recipeService } from '../services/supabase';
import type { Recipe, SearchFilters } from '../types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getAll();
      setRecipes(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Rezepte');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipe: any) => {
    try {
      setError(null);
      const newRecipe = await recipeService.create(recipe);
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Rezepts');
      throw err;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      setError(null);
      const updatedRecipe = await recipeService.update(id, updates);
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe))
      );
      return updatedRecipe;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren des Rezepts');
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      setError(null);
      await recipeService.delete(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen des Rezepts');
      throw err;
    }
  };

  const searchRecipes = async (query: string, filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.search(query, filters);
      setRecipes(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler bei der Rezeptsuche');
      console.error('Error searching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMyRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeService.getUserRecipes();
      setRecipes(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden Ihrer Rezepte');
      console.error('Error fetching user recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    getMyRecipes,
    refreshRecipes: fetchRecipes,
  };
}
