import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, Download, AlertCircle } from 'lucide-react';
import { useMealPlan } from '../hooks/useMealPlan';
import { useShoppingLists } from '../hooks/useShoppingLists';
import {
  MealPlanCalendar,
  AddMealPlanModal,
  MealPlanDetailModal,
} from '../components/mealplan';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import type { MealPlan } from '../types';

export const MealPlanningPage: React.FC = () => {
  const {
    mealPlans,
    loading,
    error,
    getMealPlansByDateRange,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
    generateShoppingListFromPlans,
  } = useMealPlan();
  const { addList } = useShoppingLists();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>('');

  useEffect(() => {
    // Load current week's meal plans
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    getMealPlansByDateRange(
      weekStart.toISOString().split('T')[0],
      weekEnd.toISOString().split('T')[0]
    );
  }, []);

  const handleDateClick = (date: Date, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  const handlePlanClick = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateMealPlan(id, { is_completed: completed });
  };

  const handleGenerateShoppingList = async () => {
    if (mealPlans.length === 0) {
      alert('Keine Mahlzeiten geplant. Fügen Sie zuerst Mahlzeiten hinzu!');
      return;
    }

    const planIds = mealPlans
      .filter((plan) => !plan.is_completed)
      .map((plan) => plan.id);

    if (planIds.length === 0) {
      alert('Alle geplanten Mahlzeiten sind bereits gekocht!');
      return;
    }

    const items = generateShoppingListFromPlans(planIds);

    if (items.length === 0) {
      alert('Keine Zutaten gefunden.');
      return;
    }

    try {
      await addList({
        name: `Einkaufsliste für Meal Plan (${new Date().toLocaleDateString('de-DE')})`,
        items,
        status: 'Aktiv',
      });
      alert('Einkaufsliste erfolgreich erstellt!');
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert('Fehler beim Erstellen der Einkaufsliste');
    }
  };

  const handleExportPlan = () => {
    const planText = mealPlans
      .map((plan) => {
        const date = new Date(plan.date).toLocaleDateString('de-DE');
        return `${date} - ${plan.meal_type}: ${plan.recipe?.title || 'Unbekannt'} (${
          plan.servings
        } Portionen)`;
      })
      .join('\n');

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedPlans = mealPlans.filter((p) => p.is_completed).length;
  const pendingPlans = mealPlans.length - completedPlans;

  if (loading) {
    return <Loading fullScreen text="Lade Essensplan..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-600" />
            Meal Planning
          </h1>
          <p className="text-gray-600 mt-2">
            Planen Sie Ihre Mahlzeiten für die Woche und erstellen Sie Einkaufslisten
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleGenerateShoppingList}
            disabled={mealPlans.length === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Einkaufsliste erstellen
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportPlan}
            disabled={mealPlans.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportieren
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Geplante Mahlzeiten</p>
                <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-xl">⏳</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ausstehend</p>
                <p className="text-2xl font-bold text-blue-600">{pendingPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-xl">✓</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gekocht</p>
                <p className="text-2xl font-bold text-green-600">{completedPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <MealPlanCalendar
        mealPlans={mealPlans}
        onDateClick={handleDateClick}
        onPlanClick={handlePlanClick}
      />

      {/* Info Card */}
      {mealPlans.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Noch keine Mahlzeiten geplant
            </h3>
            <p className="text-gray-600 mb-4">
              Klicken Sie auf ein Feld im Kalender, um eine Mahlzeit hinzuzufügen
            </p>
            <div className="max-w-md mx-auto text-left">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Tipps:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Planen Sie Ihre Wochenmahlzeiten im Voraus</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Erstellen Sie automatisch Einkaufslisten aus Ihrem Plan</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Markieren Sie gekochte Mahlzeiten als erledigt</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Exportieren Sie Ihren Plan zum Teilen oder Drucken</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AddMealPlanModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDate(null);
          setSelectedMealType('');
        }}
        onAdd={addMealPlan}
        defaultDate={selectedDate || undefined}
        defaultMealType={selectedMealType}
      />

      <MealPlanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPlan(null);
        }}
        mealPlan={selectedPlan}
        onToggleComplete={handleToggleComplete}
        onDelete={deleteMealPlan}
      />
    </div>
  );
};
