import React, { useState } from 'react';
import { Sparkles, ChefHat, AlertCircle } from 'lucide-react';
import { usePantry } from '../hooks/usePantry';
import { useRecipes } from '../hooks/useRecipes';
import { useGemini } from '../hooks/useGemini';
import { GeneratedRecipeCard } from '../components/ai/GeneratedRecipeCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import type { GeminiRecipeRequest } from '../types/api.types';
import type { Recipe } from '../types';

export const AIRecipeGeneratorPage: React.FC = () => {
  const { items: pantryItems, loading: pantryLoading } = usePantry();
  const { addRecipe } = useRecipes();
  const { generateRecipes, loading: aiLoading, error: aiError } = useGemini();

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    cuisine: '',
    maxTime: '',
    difficulty: '',
    servings: '4',
    dietary: [] as string[],
  });
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const toggleDietary = (pref: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(pref)
        ? prev.dietary.filter((d) => d !== pref)
        : [...prev.dietary, pref],
    }));
  };

  const handleGenerate = async () => {
    if (selectedIngredients.length === 0) {
      alert('Bitte wählen Sie mindestens eine Zutat aus!');
      return;
    }

    const request: GeminiRecipeRequest = {
      ingredients: selectedIngredients,
      preferences: {
        cuisine: preferences.cuisine || undefined,
        maxTime: preferences.maxTime ? parseInt(preferences.maxTime) : undefined,
        difficulty: preferences.difficulty || undefined,
        servings: parseInt(preferences.servings) || 4,
        dietary: preferences.dietary.length > 0 ? preferences.dietary : undefined,
      },
    };

    const response = await generateRecipes(request);
    if (response && response.recipes) {
      setGeneratedRecipes(response.recipes);
      setShowResults(true);
    }
  };

  const handleSaveRecipe = async (generatedRecipe: any) => {
    try {
      const recipe: Omit<Recipe, 'id' | 'created_at' | 'user_id' | 'rating'> = {
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        prep_time: generatedRecipe.prepTime,
        cook_time: generatedRecipe.cookTime,
        servings: generatedRecipe.servings,
        difficulty: generatedRecipe.difficulty as any,
        calories: generatedRecipe.estimatedCalories || null,
        nutrition: null,
        tags: [],
        image_url: null,
      };

      await addRecipe(recipe);
      alert('Rezept erfolgreich gespeichert!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Fehler beim Speichern des Rezepts');
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setGeneratedRecipes([]);
    setSelectedIngredients([]);
    setPreferences({
      cuisine: '',
      maxTime: '',
      difficulty: '',
      servings: '4',
      dietary: [],
    });
  };

  if (pantryLoading) {
    return <Loading fullScreen text="Lade Vorräte..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-600" />
            KI-Rezeptgenerator
          </h1>
          <p className="text-gray-600 mt-2">
            Erstellen Sie Rezepte basierend auf Ihren verfügbaren Zutaten mit KI-Unterstützung
          </p>
        </div>
        {showResults && (
          <Button onClick={handleReset} variant="secondary">
            Neue Suche
          </Button>
        )}
      </div>

      {/* Error Message */}
      {aiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {aiError}
        </div>
      )}

      {/* API Key Warning */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-1">⚠️ Gemini API-Schlüssel fehlt</p>
          <p className="text-sm">
            Bitte setzen Sie <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> in Ihrer .env Datei,
            um den KI-Rezeptgenerator zu nutzen.
          </p>
        </div>
      )}

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ingredient Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>1. Zutaten auswählen ({selectedIngredients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pantryItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Keine Vorräte vorhanden. Fügen Sie zuerst Zutaten zu Ihrem Vorratsschrank hinzu.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {pantryItems.map((item) => (
                      <Badge
                        key={item.id}
                        className={`cursor-pointer transition-colors ${
                          selectedIngredients.includes(item.name)
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleIngredient(item.name)}
                      >
                        {item.name} ({item.quantity} {item.unit})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>2. Präferenzen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Küche (optional)
                  </label>
                  <Input
                    placeholder="z.B. Italienisch, Asiatisch"
                    value={preferences.cuisine}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, cuisine: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Zeit (Min.)
                  </label>
                  <Input
                    type="number"
                    placeholder="z.B. 30"
                    value={preferences.maxTime}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, maxTime: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schwierigkeit
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={preferences.difficulty}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, difficulty: e.target.value }))
                    }
                  >
                    <option value="">Beliebig</option>
                    <option value="Einfach">Einfach</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Schwer">Schwer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portionen
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={preferences.servings}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, servings: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ernährungsweise
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarisch', 'Vegan', 'Glutenfrei', 'Laktosefrei'].map((diet) => (
                      <Badge
                        key={diet}
                        className={`cursor-pointer transition-colors ${
                          preferences.dietary.includes(diet)
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleDietary(diet)}
                      >
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={aiLoading || selectedIngredients.length === 0}
              className="w-full mt-4"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Generiere Rezepte...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Rezepte generieren
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        // Results
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Generierte Rezepte ({generatedRecipes.length})
            </h2>
            <p className="text-gray-600 mt-1">
              Basierend auf: {selectedIngredients.join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedRecipes.map((recipe, index) => (
              <GeneratedRecipeCard
                key={index}
                recipe={recipe}
                onSave={handleSaveRecipe}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
