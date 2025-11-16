import { useState, useEffect } from 'react';
import { shoppingListService } from '../services/supabase';
import type { ShoppingList } from '../types';

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shoppingListService.getAll();
      setLists(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Einkaufslisten');
      console.error('Error fetching shopping lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const addList = async (list: Omit<ShoppingList, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      const newList = await shoppingListService.create(list as any);
      setLists((prev) => [newList, ...prev]);
      return newList;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen der Einkaufsliste');
      throw err;
    }
  };

  const updateList = async (id: string, updates: Partial<ShoppingList>) => {
    try {
      setError(null);
      const updatedList = await shoppingListService.update(id, updates);
      setLists((prev) =>
        prev.map((list) => (list.id === id ? updatedList : list))
      );
      return updatedList;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren der Einkaufsliste');
      throw err;
    }
  };

  const deleteList = async (id: string) => {
    try {
      setError(null);
      await shoppingListService.delete(id);
      setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen der Einkaufsliste');
      throw err;
    }
  };

  const getActiveLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shoppingListService.getActive();
      setLists(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der aktiven Listen');
      console.error('Error fetching active lists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return {
    lists,
    loading,
    error,
    addList,
    updateList,
    deleteList,
    getActiveLists,
    refreshLists: fetchLists,
  };
}
