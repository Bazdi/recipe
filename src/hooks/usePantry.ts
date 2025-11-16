import { useState, useEffect } from 'react';
import { pantryService } from '../services/supabase';
import type { PantryItem } from '../types';

export function usePantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pantryService.getAll();
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Vorratsschrank-Artikel');
      console.error('Error fetching pantry items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<PantryItem, 'id' | 'created_at' | 'user_id'>) => {
    try {
      setError(null);
      const newItem = await pantryService.create(item as any);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Hinzufügen des Artikels');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<PantryItem>) => {
    try {
      setError(null);
      const updatedItem = await pantryService.update(id, updates);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren des Artikels');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      await pantryService.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || 'Fehler beim Löschen des Artikels');
      throw err;
    }
  };

  const getExpiringItems = async (days: number = 7) => {
    try {
      setError(null);
      const data = await pantryService.getExpiringSoon(days);
      return data || [];
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden ablaufender Artikel');
      return [];
    }
  };

  const getItemsByCategory = async (category: string) => {
    try {
      setError(null);
      const data = await pantryService.getByCategory(category);
      return data || [];
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Artikel nach Kategorie');
      return [];
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
    getExpiringItems,
    getItemsByCategory,
  };
}
