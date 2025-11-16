import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Package, ShoppingCart, Target, AlertCircle, Sparkles, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { usePantry } from '../hooks/usePantry';
import { useRecipes } from '../hooks/useRecipes';
import { useGoals } from '../hooks/useGoals';
import { useShoppingLists } from '../hooks/useShoppingLists';

export const Dashboard: React.FC = () => {
  const { items: pantryItems, loading: pantryLoading } = usePantry();
  const { recipes, loading: recipesLoading } = useRecipes();
  const { goals, loading: goalsLoading } = useGoals();
  const { lists: shoppingLists, loading: shoppingLoading } = useShoppingLists();

  const [expiringCount, setExpiringCount] = useState(0);

  useEffect(() => {
    // Count expiring items (within 7 days)
    const count = pantryItems.filter((item) => {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return expiryDate <= sevenDaysFromNow;
    }).length;
    setExpiringCount(count);
  }, [pantryItems]);

  const isLoading = pantryLoading || recipesLoading || goalsLoading || shoppingLoading;

  const activeGoals = goals.filter((g) => (g.current_value / g.target_value) * 100 < 100).length;
  const activeLists = shoppingLists.filter((l) => l.status === 'Aktiv').length;

  if (isLoading) {
    return <Loading fullScreen text="Lade Dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Willkommen bei RecipeMaster - Ihr intelligentes Rezept-Tool
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/recipes">
          <Card hoverable>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rezepte</p>
                  <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/pantry">
          <Card hoverable>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vorratsschrank</p>
                  <p className="text-2xl font-bold text-gray-900">{pantryItems.length}</p>
                  {expiringCount > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      {expiringCount} läuft bald ab
                    </p>
                  )}
                </div>
                <Package className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/shopping">
          <Card hoverable>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Einkaufslisten</p>
                  <p className="text-2xl font-bold text-gray-900">{shoppingLists.length}</p>
                  {activeLists > 0 && (
                    <p className="text-xs text-blue-600 mt-1">{activeLists} aktiv</p>
                  )}
                </div>
                <ShoppingCart className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/goals">
          <Card hoverable>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktive Ziele</p>
                  <p className="text-2xl font-bold text-gray-900">{activeGoals}</p>
                  <p className="text-xs text-gray-500 mt-1">von {goals.length} gesamt</p>
                </div>
                <Target className="w-12 h-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* AI Features Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <CardTitle className="text-purple-900">KI-gestützte Features</CardTitle>
            <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
              NEU
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Nutzen Sie künstliche Intelligenz, um Rezepte zu generieren und Lebensmittel zu erkennen
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/ai-recipes">
              <Card hoverable className="h-full border-purple-200 hover:border-purple-400">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Rezept-Generator
                      </h4>
                      <p className="text-sm text-gray-600">
                        Lassen Sie die KI kreative Rezepte aus Ihren Vorräten erstellen
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/image-recognition">
              <Card hoverable className="h-full border-purple-200 hover:border-purple-400">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Bilderkennung</h4>
                      <p className="text-sm text-gray-600">
                        Fotografieren Sie Lebensmittel und lassen Sie sie automatisch erkennen
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items Alert */}
      {expiringCount > 0 && (
        <Card className="border-l-4 border-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Artikel laufen bald ab!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Sie haben {expiringCount} Artikel, die innerhalb der nächsten 7 Tage ablaufen.
                </p>
                <Link to="/pantry">
                  <Button size="sm" className="mt-3">
                    Vorratsschrank ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/recipes">
              <Button fullWidth variant="primary">
                <BookOpen className="w-5 h-5 mr-2" />
                Neues Rezept erstellen
              </Button>
            </Link>
            <Link to="/pantry">
              <Button fullWidth variant="secondary">
                <Package className="w-5 h-5 mr-2" />
                Vorratsschrank verwalten
              </Button>
            </Link>
            <Link to="/shopping">
              <Button fullWidth variant="secondary">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Einkaufsliste erstellen
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Zielfortschritt</CardTitle>
              <Link to="/goals">
                <Button size="sm" variant="ghost">
                  Alle anzeigen
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>Noch keine Ziele gesetzt</p>
                <Link to="/goals">
                  <Button size="sm" className="mt-3">
                    Ziele erstellen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.slice(0, 3).map((goal) => {
                  const progress = (goal.current_value / goal.target_value) * 100;
                  return (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{goal.goal_type}</span>
                        <span className="text-gray-600">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            progress >= 100 ? 'bg-green-500' : 'bg-primary-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Erste Schritte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Vorratsschrank befüllen</h4>
                  <p className="text-sm text-gray-600">
                    Fügen Sie Ihre verfügbaren Zutaten hinzu
                  </p>
                  {pantryItems.length === 0 && (
                    <Link to="/pantry">
                      <Button size="sm" className="mt-2">
                        Jetzt starten
                      </Button>
                    </Link>
                  )}
                  {pantryItems.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {pantryItems.length} Artikel hinzugefügt
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Rezepte entdecken</h4>
                  <p className="text-sm text-gray-600">
                    Lassen Sie sich von der KI Rezepte vorschlagen
                  </p>
                  {recipes.length === 0 && (
                    <Link to="/recipes">
                      <Button size="sm" className="mt-2">
                        Jetzt starten
                      </Button>
                    </Link>
                  )}
                  {recipes.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {recipes.length} Rezepte erstellt
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ziele setzen</h4>
                  <p className="text-sm text-gray-600">
                    Definieren Sie Ihre Ernährungsziele
                  </p>
                  {goals.length === 0 && (
                    <Link to="/goals">
                      <Button size="sm" className="mt-2">
                        Jetzt starten
                      </Button>
                    </Link>
                  )}
                  {goals.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {goals.length} Ziele gesetzt
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
