import React, { useState, useEffect } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import type { MealPlan, Recipe } from '../../types';

interface AddMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: Omit<MealPlan, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  defaultDate?: Date;
  defaultMealType?: string;
}

export const AddMealPlanModal: React.FC<AddMealPlanModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultDate,
  defaultMealType,
}) => {
  const { recipes } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('Mittagessen');
  const [servings, setServings] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultDate) {
        setDate(defaultDate.toISOString().split('T')[0]);
      }
      if (defaultMealType) {
        setMealType(defaultMealType);
      }
    }
  }, [isOpen, defaultDate, defaultMealType]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe || !date) return;

    setSubmitting(true);
    try {
      await onAdd({
        recipe_id: selectedRecipe.id,
        date,
        meal_type: mealType as any,
        servings: servings ? parseInt(servings) : selectedRecipe.servings,
        notes: notes || null,
        is_completed: false,
      });
      handleClose();
    } catch (error) {
      console.error('Error adding meal plan:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRecipe(null);
    setDate('');
    setMealType('Mittagessen');
    setServings('');
    setNotes('');
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mahlzeit planen">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Meal Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum *
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mahlzeit *
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="Frühstück">Frühstück</option>
              <option value="Mittagessen">Mittagessen</option>
              <option value="Abendessen">Abendessen</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        {/* Recipe Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rezept auswählen *
          </label>
          <Input
            type="text"
            placeholder="Rezept suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredRecipes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'Keine Rezepte gefunden' : 'Keine Rezepte vorhanden'}
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setServings(recipe.servings.toString());
                    }}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                      selectedRecipe?.id === recipe.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {recipe.prep_time + recipe.cook_time} Min. • {recipe.servings} Portionen
                        </p>
                      </div>
                      {selectedRecipe?.id === recipe.id && (
                        <Badge className="bg-primary-600 text-white">✓</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Recipe Info */}
        {selectedRecipe && (
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Ausgewähltes Rezept:</h4>
            <p className="text-sm text-gray-700">{selectedRecipe.title}</p>
            <p className="text-sm text-gray-600 mt-1">{selectedRecipe.description}</p>
          </div>
        )}

        {/* Servings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portionen
          </label>
          <Input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder={selectedRecipe ? `Standard: ${selectedRecipe.servings}` : ''}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notizen (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="z.B. Einkaufsliste erstellen, Vorbereitung am Vortag..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            fullWidth
            disabled={submitting}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            fullWidth
            disabled={!selectedRecipe || !date || submitting}
          >
            {submitting ? 'Wird hinzugefügt...' : 'Hinzufügen'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
