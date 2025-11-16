import React, { useMemo } from 'react';
import { PieChart, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { useMealPlan } from '../hooks/useMealPlan';
import { useGoals } from '../hooks/useGoals';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';

export const NutritionDashboardPage: React.FC = () => {
  const { mealPlans, loading: mealPlansLoading } = useMealPlan();
  const { goals, loading: goalsLoading } = useGoals();

  const nutritionStats = useMemo(() => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let mealCount = 0;

    mealPlans.forEach((plan) => {
      if (plan.is_completed && plan.recipe) {
        const servingMultiplier = plan.servings / plan.recipe.servings;

        if (plan.recipe.calories) {
          totalCalories += plan.recipe.calories * servingMultiplier;
        }

        if (plan.recipe.nutrition) {
          totalProtein += plan.recipe.nutrition.protein * servingMultiplier;
          totalCarbs += plan.recipe.nutrition.carbs * servingMultiplier;
          totalFat += plan.recipe.nutrition.fat * servingMultiplier;
        }

        mealCount++;
      }
    });

    const avgCaloriesPerMeal = mealCount > 0 ? Math.round(totalCalories / mealCount) : 0;

    return {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      avgCaloriesPerMeal,
      mealCount,
    };
  }, [mealPlans]);

  const nutritionGoals = useMemo(() => {
    return {
      calories: goals.find((g) => g.goal_type === 'Kalorien'),
      protein: goals.find((g) => g.goal_type === 'Protein'),
      carbs: goals.find((g) => g.goal_type === 'Kohlenhydrate'),
      fat: goals.find((g) => g.goal_type === 'Fett'),
    };
  }, [goals]);

  const getGoalProgress = (current: number, target?: number) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getMacroPercentage = (value: number) => {
    const total = nutritionStats.totalProtein + nutritionStats.totalCarbs + nutritionStats.totalFat;
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const isLoading = mealPlansLoading || goalsLoading;

  if (isLoading) {
    return <Loading fullScreen text="Lade Nährwertdaten..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PieChart className="w-8 h-8 text-primary-600" />
          Nährwert-Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Verfolgen Sie Ihre Ernährungsziele und analysieren Sie Ihre Mahlzeiten
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🔥</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kalorien (Gesamt)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {nutritionStats.totalCalories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-2xl">💪</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Protein</p>
                <p className="text-2xl font-bold text-blue-600">
                  {nutritionStats.totalProtein}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🌾</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kohlenhydrate</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {nutritionStats.totalCarbs}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🥑</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fett</p>
                <p className="text-2xl font-bold text-purple-600">
                  {nutritionStats.totalFat}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Fortschritt zu Ihren Zielen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goals.filter((g) =>
            ['Kalorien', 'Protein', 'Kohlenhydrate', 'Fett'].includes(g.goal_type)
          ).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Keine Ernährungsziele gesetzt</p>
              <p className="text-sm mt-1">Erstellen Sie Ziele, um Ihren Fortschritt zu verfolgen</p>
            </div>
          ) : (
            <div className="space-y-6">
              {nutritionGoals.calories && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">Kalorien</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({nutritionGoals.calories.period})
                      </span>
                    </div>
                    <Badge
                      className={
                        nutritionGoals.calories.current_value >= nutritionGoals.calories.target_value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {Math.round(
                        (nutritionGoals.calories.current_value /
                          nutritionGoals.calories.target_value) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{
                            width: `${getGoalProgress(
                              nutritionGoals.calories.current_value,
                              nutritionGoals.calories.target_value
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[120px] text-right">
                      {Math.round(nutritionGoals.calories.current_value)} /{' '}
                      {Math.round(nutritionGoals.calories.target_value)} kcal
                    </span>
                  </div>
                </div>
              )}

              {nutritionGoals.protein && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">Protein</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({nutritionGoals.protein.period})
                      </span>
                    </div>
                    <Badge
                      className={
                        nutritionGoals.protein.current_value >= nutritionGoals.protein.target_value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {Math.round(
                        (nutritionGoals.protein.current_value / nutritionGoals.protein.target_value) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{
                            width: `${getGoalProgress(
                              nutritionGoals.protein.current_value,
                              nutritionGoals.protein.target_value
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[120px] text-right">
                      {Math.round(nutritionGoals.protein.current_value)} /{' '}
                      {Math.round(nutritionGoals.protein.target_value)}g
                    </span>
                  </div>
                </div>
              )}

              {nutritionGoals.carbs && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">Kohlenhydrate</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({nutritionGoals.carbs.period})
                      </span>
                    </div>
                    <Badge
                      className={
                        nutritionGoals.carbs.current_value >= nutritionGoals.carbs.target_value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {Math.round(
                        (nutritionGoals.carbs.current_value / nutritionGoals.carbs.target_value) *
                          100
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 transition-all duration-300"
                          style={{
                            width: `${getGoalProgress(
                              nutritionGoals.carbs.current_value,
                              nutritionGoals.carbs.target_value
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[120px] text-right">
                      {Math.round(nutritionGoals.carbs.current_value)} /{' '}
                      {Math.round(nutritionGoals.carbs.target_value)}g
                    </span>
                  </div>
                </div>
              )}

              {nutritionGoals.fat && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">Fett</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({nutritionGoals.fat.period})
                      </span>
                    </div>
                    <Badge
                      className={
                        nutritionGoals.fat.current_value >= nutritionGoals.fat.target_value
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {Math.round(
                        (nutritionGoals.fat.current_value / nutritionGoals.fat.target_value) * 100
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{
                            width: `${getGoalProgress(
                              nutritionGoals.fat.current_value,
                              nutritionGoals.fat.target_value
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[120px] text-right">
                      {Math.round(nutritionGoals.fat.current_value)} /{' '}
                      {Math.round(nutritionGoals.fat.target_value)}g
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Macro Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Makronährstoff-Verteilung</CardTitle>
          </CardHeader>
          <CardContent>
            {nutritionStats.mealCount === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Keine Mahlzeiten gekocht. Planen und kochen Sie Mahlzeiten, um Daten zu sehen.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {/* Protein - Blue */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${getMacroPercentage(nutritionStats.totalProtein)} 100`}
                      />
                      {/* Carbs - Yellow */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="20"
                        strokeDasharray={`${getMacroPercentage(nutritionStats.totalCarbs)} 100`}
                        strokeDashoffset={`-${getMacroPercentage(nutritionStats.totalProtein)}`}
                      />
                      {/* Fat - Purple */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="20"
                        strokeDasharray={`${getMacroPercentage(nutritionStats.totalFat)} 100`}
                        strokeDashoffset={`-${
                          getMacroPercentage(nutritionStats.totalProtein) +
                          getMacroPercentage(nutritionStats.totalCarbs)
                        }`}
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-700">Protein</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {getMacroPercentage(nutritionStats.totalProtein)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                      <span className="text-sm text-gray-700">Kohlenhydrate</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {getMacroPercentage(nutritionStats.totalCarbs)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full" />
                      <span className="text-sm text-gray-700">Fett</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {getMacroPercentage(nutritionStats.totalFat)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Durchschnittliche Kalorien pro Mahlzeit
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {nutritionStats.avgCaloriesPerMeal} kcal
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Basierend auf {nutritionStats.mealCount} gekochten Mahlzeiten
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✨</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tipp des Tages</h4>
                    <p className="text-sm text-gray-700">
                      Eine ausgewogene Ernährung sollte etwa 30% Protein, 40% Kohlenhydrate und
                      30% Fett enthalten. Passen Sie Ihre Mahlzeiten entsprechend an!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Nächste Schritte</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Setzen Sie spezifische Ernährungsziele</li>
                      <li>• Planen Sie Ihre Mahlzeiten im Voraus</li>
                      <li>• Verfolgen Sie Ihren täglichen Fortschritt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
