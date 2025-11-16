import React from 'react';
import { Clock, Users, ChefHat, X } from 'lucide-react';
import type { Recipe } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface RecipeDetailModalProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
}

const difficultyColors = {
  Einfach: 'success',
  Mittel: 'warning',
  Schwer: 'danger',
} as const;

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  isOpen,
  recipe,
  onClose,
}) => {
  if (!recipe) return null;

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
      {/* Header Image */}
      <div className="relative -mx-6 -mt-6 mb-6">
        <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-lg">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-24 h-24 text-primary-600 opacity-50" />
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={difficultyColors[recipe.difficulty]}>
            {recipe.difficulty}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title & Description */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
          <p className="text-gray-600">{recipe.description}</p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 pb-4 border-b">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Gesamtzeit</p>
              <p className="font-semibold">{totalTime} Min</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Vorbereitung</p>
              <p className="font-semibold">{recipe.prep_time} Min</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Kochzeit</p>
              <p className="font-semibold">{recipe.cook_time} Min</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Portionen</p>
              <p className="font-semibold">{recipe.servings}</p>
            </div>
          </div>

          {recipe.calories && (
            <div className="flex items-center gap-2 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Kalorien/Portion</p>
                <p className="font-semibold">{recipe.calories} kcal</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Ingredients */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Zutaten</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                  <span>
                    <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                    {' '}
                    {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-gray-500 text-sm"> ({ingredient.notes})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Anweisungen</h3>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {instruction.step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700">{instruction.description}</p>
                  {instruction.duration && (
                    <p className="text-sm text-gray-500 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {instruction.duration} Min
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition (if available) */}
        {recipe.nutrition && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Nährwerte pro Portion</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Kalorien</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {recipe.nutrition.calories} kcal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {recipe.nutrition.protein}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kohlenhydrate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {recipe.nutrition.carbs}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fett</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {recipe.nutrition.fat}g
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
