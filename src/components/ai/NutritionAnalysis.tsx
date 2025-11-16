import React, { useState } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import type { Recipe } from '../../types';

interface NutritionAnalysisProps {
  recipe: Recipe;
}

export const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({ recipe }) => {
  const { analyzeNutrition, loading, error } = useGemini();
  const [nutritionData, setNutritionData] = useState<any | null>(null);

  const handleAnalyze = async () => {
    const response = await analyzeNutrition({
      ingredients: recipe.ingredients,
    });

    if (response) {
      setNutritionData(response);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Nährwertanalyse (KI)
          </CardTitle>
          {!nutritionData && (
            <Button onClick={handleAnalyze} disabled={loading} size="sm">
              {loading ? 'Analysiere...' : 'Analysieren'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!nutritionData && !loading && !error && (
          <p className="text-gray-500 text-center py-4">
            Klicken Sie auf "Analysieren", um die Nährwerte mit KI zu berechnen
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" />
          </div>
        )}

        {nutritionData && (
          <div className="space-y-6">
            {/* Per Serving */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Pro Portion:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Kalorien</p>
                  <p className="text-2xl font-bold text-primary-700">
                    {nutritionData.perServing.calories}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {nutritionData.perServing.protein}g
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Kohlenhydrate</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {nutritionData.perServing.carbs}g
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Fett</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {nutritionData.perServing.fat}g
                  </p>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Makronährstoffe (Gesamt):</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protein</span>
                    <span className="font-medium">{nutritionData.macros.protein}g</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (nutritionData.macros.protein / nutritionData.totalCalories) * 100 * 4,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Kohlenhydrate</span>
                    <span className="font-medium">{nutritionData.macros.carbs}g</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (nutritionData.macros.carbs / nutritionData.totalCalories) * 100 * 4,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fett</span>
                    <span className="font-medium">{nutritionData.macros.fat}g</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (nutritionData.macros.fat / nutritionData.totalCalories) * 100 * 9,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ballaststoffe</span>
                    <span className="font-medium">{nutritionData.macros.fiber}g</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${Math.min((nutritionData.macros.fiber / 50) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vitamins & Minerals */}
            {nutritionData.vitamins && Object.keys(nutritionData.vitamins).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Vitamine:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(nutritionData.vitamins).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Vitamin {key}</p>
                      <p className="text-sm font-semibold">{value as number}mg</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nutritionData.minerals && Object.keys(nutritionData.minerals).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Mineralstoffe:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(nutritionData.minerals).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">{key}</p>
                      <p className="text-sm font-semibold">{value as number}mg</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 Nährwerte wurden mit KI geschätzt und können abweichen
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
