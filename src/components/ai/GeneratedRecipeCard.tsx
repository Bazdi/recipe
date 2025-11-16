import React from 'react';
import { Clock, Users, ChefHat, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: Array<{
    step: number;
    description: string;
  }>;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  servings: number;
  estimatedCalories?: number;
}

interface GeneratedRecipeCardProps {
  recipe: GeneratedRecipe;
  onSave?: (recipe: GeneratedRecipe) => void;
}

export const GeneratedRecipeCard: React.FC<GeneratedRecipeCardProps> = ({
  recipe,
  onSave,
}) => {
  const totalTime = recipe.prepTime + recipe.cookTime;

  const difficultyColors: Record<string, string> = {
    Einfach: 'bg-green-100 text-green-800',
    Mittel: 'bg-yellow-100 text-yellow-800',
    Schwer: 'bg-red-100 text-red-800',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{recipe.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
          </div>
          {onSave && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSave(recipe)}
              className="ml-4"
            >
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{totalTime} Min.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} Portionen</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChefHat className="w-4 h-4" />
            <Badge className={difficultyColors[recipe.difficulty] || difficultyColors.Mittel}>
              {recipe.difficulty}
            </Badge>
          </div>
          {recipe.estimatedCalories && (
            <div className="text-sm text-gray-600">
              ca. {recipe.estimatedCalories} kcal/Portion
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Zutaten:</h4>
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
          <h4 className="font-semibold text-gray-900 mb-3">Zubereitung:</h4>
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
      </CardContent>
    </Card>
  );
};
