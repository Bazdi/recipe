import React, { useState } from 'react';
import { Plus, AlertCircle, Filter, BookOpen } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCard, AddRecipeModal, RecipeDetailModal } from '../components/recipes';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import type { Recipe } from '../types';

export const RecipesPage: React.FC = () => {
  const { recipes, loading, error, addRecipe, deleteRecipe, getMyRecipes, refreshRecipes } = useRecipes();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showMyRecipes, setShowMyRecipes] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie dieses Rezept wirklich löschen?')) {
      await deleteRecipe(id);
    }
  };

  const handleShowMyRecipes = async () => {
    if (!showMyRecipes) {
      await getMyRecipes();
      setShowMyRecipes(true);
    } else {
      await refreshRecipes();
      setShowMyRecipes(false);
    }
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    if (difficultyFilter && recipe.difficulty !== difficultyFilter) {
      return false;
    }
    return true;
  });

  // Count by difficulty
  const difficultyCounts = {
    Einfach: recipes.filter((r) => r.difficulty === 'Einfach').length,
    Mittel: recipes.filter((r) => r.difficulty === 'Mittel').length,
    Schwer: recipes.filter((r) => r.difficulty === 'Schwer').length,
  };

  if (loading) {
    return <Loading fullScreen text="Lade Rezepte..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meine Rezepte</h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre Rezeptsammlung
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showMyRecipes ? 'primary' : 'secondary'}
            onClick={handleShowMyRecipes}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {showMyRecipes ? 'Alle Rezepte' : 'Meine Rezepte'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Neues Rezept
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Gesamt Rezepte</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{recipes.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Einfach</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{difficultyCounts.Einfach}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Mittel</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{difficultyCounts.Mittel}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Schwer</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{difficultyCounts.Schwer}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Schwierigkeit:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={difficultyFilter === null ? 'info' : 'default'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setDifficultyFilter(null)}
            >
              Alle ({recipes.length})
            </Badge>

            <Badge
              variant={difficultyFilter === 'Einfach' ? 'success' : 'default'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setDifficultyFilter('Einfach')}
            >
              Einfach ({difficultyCounts.Einfach})
            </Badge>

            <Badge
              variant={difficultyFilter === 'Mittel' ? 'warning' : 'default'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setDifficultyFilter('Mittel')}
            >
              Mittel ({difficultyCounts.Mittel})
            </Badge>

            <Badge
              variant={difficultyFilter === 'Schwer' ? 'danger' : 'default'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setDifficultyFilter('Schwer')}
            >
              Schwer ({difficultyCounts.Schwer})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {recipes.length === 0
                ? 'Noch keine Rezepte vorhanden. Erstellen Sie Ihr erstes Rezept!'
                : 'Keine Rezepte gefunden für die ausgewählten Filter.'}
            </p>
            {recipes.length === 0 && (
              <Button
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Erstes Rezept erstellen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={setSelectedRecipe}
              onEdit={(recipe) => {
                // TODO: Implement edit functionality
                console.log('Edit recipe:', recipe);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddRecipeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRecipe}
      />

      <RecipeDetailModal
        isOpen={selectedRecipe !== null}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};
