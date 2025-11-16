import { useState, useEffect } from 'react';
import { goalsService } from '../services/supabase';
import type { UserGoal } from '../types';

export function useGoals() {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsService.getAll();
      setGoals(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Ziele');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<UserGoal, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      const newGoal = await goalsService.create(goal as any);
      setGoals((prev) => [newGoal, ...prev]);
      return newGoal;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Ziels');
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<UserGoal>) => {
    try {
      setError(null);
      const updatedGoal = await goalsService.update(id, updates);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
      return updatedGoal;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren des Ziels');
      throw err;
    }
  };

  const updateProgress = async (id: string, currentValue: number) => {
    try {
      setError(null);
      const updatedGoal = await goalsService.updateProgress(id, currentValue);
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
      return updatedGoal;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren des Fortschritts');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setError(null);
      await goalsService.delete(id);
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen des Ziels');
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    updateProgress,
    deleteGoal,
    refreshGoals: fetchGoals,
  };
}
