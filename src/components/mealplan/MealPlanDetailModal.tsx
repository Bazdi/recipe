import React from 'react';
import { Clock, Users, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { MealPlan } from '../../types';

interface MealPlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: MealPlan | null;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}

export const MealPlanDetailModal: React.FC<MealPlanDetailModalProps> = ({
  isOpen,
  onClose,
  mealPlan,
  onToggleComplete,
  onDelete,
}) => {
  if (!mealPlan || !mealPlan.recipe) return null;

  const { recipe } = mealPlan;
  const totalTime = recipe.prep_time + recipe.cook_time;

  const handleToggleComplete = async () => {
    await onToggleComplete(mealPlan.id, !mealPlan.is_completed);
  };

  const handleDelete = () => {
    if (window.confirm('Möchten Sie diese geplante Mahlzeit wirklich löschen?')) {
      onDelete(mealPlan.id);
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Geplante Mahlzeit">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
            <Badge
              className={
                mealPlan.is_completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {mealPlan.is_completed ? 'Erledigt' : 'Geplant'}
            </Badge>
          </div>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

        {/* Plan Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Datum</p>
            <p className="font-medium text-gray-900">{formatDate(mealPlan.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mahlzeit</p>
            <p className="font-medium text-gray-900">{mealPlan.meal_type}</p>
          </div>
        </div>

        {/* Recipe Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{totalTime} Min.</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{mealPlan.servings} Portionen</span>
          </div>
          <Badge className="bg-primary-100 text-primary-700">{recipe.difficulty}</Badge>
        </div>

        {/* Notes */}
        {mealPlan.notes && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-1">Notizen:</h4>
            <p className="text-sm text-gray-700">{mealPlan.notes}</p>
          </div>
        )}

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Zutaten:</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                <span>
                  {ingredient.quantity} {ingredient.unit} {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Zubereitung:</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction) => (
              <li key={instruction.step} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  {instruction.step}
                </span>
                <span className="flex-1 pt-0.5">{instruction.description}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={handleToggleComplete}
            className="flex-1"
          >
            {mealPlan.is_completed ? (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Als ungekocht markieren
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Als gekocht markieren
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
