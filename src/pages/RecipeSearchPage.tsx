import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCard, RecipeDetailModal } from '../components/recipes';
import { Card, CardContent } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';
import type { Recipe } from '../types';

export const RecipeSearchPage: React.FC = () => {
  const { recipes, loading } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get all unique tags from recipes
  const allTags = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.tags || []))
  ).sort();

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchLower));

    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;

    // Tags filter
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => recipe.tags?.includes(tag));

    // Max time filter
    const totalTime = recipe.prep_time + recipe.cook_time;
    const matchesTime = !maxTime || totalTime <= parseInt(maxTime);

    return matchesSearch && matchesDifficulty && matchesTags && matchesTime;
  });

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    setSelectedTags([]);
    setMaxTime('');
  };

  const activeFiltersCount =
    (selectedDifficulty ? 1 : 0) + selectedTags.length + (maxTime ? 1 : 0);

  if (loading) {
    return <Loading fullScreen text="Lade Rezepte..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Search className="w-8 h-8 text-primary-600" />
          Rezeptsuche
        </h1>
        <p className="text-gray-600 mt-2">
          Durchsuchen Sie {recipes.length} Rezepte nach Zutaten, Schwierigkeit und mehr
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Suche nach Rezepten, Zutaten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filter
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-white text-primary-700 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Zurücksetzen
                </button>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schwierigkeit
                  </label>
                  <div className="flex gap-2">
                    {['Einfach', 'Mittel', 'Schwer'].map((diff) => (
                      <Badge
                        key={diff}
                        className={`cursor-pointer transition-colors ${
                          selectedDifficulty === diff
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() =>
                          setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)
                        }
                      >
                        {diff}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Max Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximale Zeit
                  </label>
                  <div className="flex gap-2">
                    {['15', '30', '45', '60'].map((time) => (
                      <Badge
                        key={time}
                        className={`cursor-pointer transition-colors ${
                          maxTime === time
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setMaxTime(maxTime === time ? '' : time)}
                      >
                        ≤ {time} Min
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`cursor-pointer transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && !showFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedDifficulty && (
                  <Badge className="bg-primary-100 text-primary-700">
                    {selectedDifficulty}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedDifficulty('')}
                    />
                  </Badge>
                )}
                {maxTime && (
                  <Badge className="bg-primary-100 text-primary-700">
                    ≤ {maxTime} Min
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => setMaxTime('')}
                    />
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="bg-primary-100 text-primary-700">
                    {tag}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredRecipes.length} Rezept{filteredRecipes.length !== 1 ? 'e' : ''} gefunden
          </h2>
        </div>

        {filteredRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Keine Rezepte gefunden
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `Keine Ergebnisse für "${searchTerm}"`
                  : 'Versuchen Sie es mit anderen Filtern'}
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Filter zurücksetzen
                </button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRecipe(null);
        }}
        recipe={selectedRecipe}
      />
    </div>
  );
};
