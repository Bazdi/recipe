import React from 'react';
import { Clock, Users, ChefHat, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Recipe } from '../../types';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
}

const difficultyColors = {
  Einfach: 'success',
  Mittel: 'warning',
  Schwer: 'danger',
} as const;

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onView,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const isOwner = user?.id === recipe.user_id;
  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <Card hoverable onClick={() => onView(recipe)} className="cursor-pointer">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-lg">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-primary-600 opacity-50" />
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={difficultyColors[recipe.difficulty]}>
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Owner indicator */}
          {isOwner && (
            <div className="absolute top-3 left-3">
              <Badge variant="info">Mein Rezept</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {recipe.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalTime} Min</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} Portionen</span>
            </div>

            {recipe.calories && (
              <div className="flex items-center gap-1">
                <span className="font-medium">{recipe.calories} kcal</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} size="sm">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge size="sm">+{recipe.tags.length - 3}</Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onView(recipe);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ansehen
            </Button>

            {isOwner && onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe);
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}

            {isOwner && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
