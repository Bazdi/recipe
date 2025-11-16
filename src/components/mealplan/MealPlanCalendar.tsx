import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import type { MealPlan } from '../../types';

interface MealPlanCalendarProps {
  mealPlans: MealPlan[];
  onDateClick: (date: Date, mealType: string) => void;
  onPlanClick: (plan: MealPlan) => void;
}

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  mealPlans,
  onDateClick,
  onPlanClick,
}) => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

  const weekDays = getWeekDays(currentWeek);
  const mealTypes = ['Frühstück', 'Mittagessen', 'Abendessen', 'Snack'];

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  function getMealPlansForDate(date: Date, mealType: string): MealPlan[] {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.filter(
      (plan) => plan.date === dateStr && plan.meal_type === mealType
    );
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(getWeekStart(newDate));
  };

  const goToToday = () => {
    setCurrentWeek(getWeekStart(new Date()));
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentWeek.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="secondary" size="sm" onClick={goToToday}>
          Heute
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 sticky left-0 z-10 w-32">
                    Mahlzeit
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`p-3 text-center text-sm font-semibold min-w-[140px] ${
                        isToday(day)
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {formatDate(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mealTypes.map((mealType) => (
                  <tr key={mealType} className="border-b border-gray-200 last:border-0">
                    <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                      {mealType}
                    </td>
                    {weekDays.map((day) => {
                      const plans = getMealPlansForDate(day, mealType);
                      const hasPlans = plans.length > 0;

                      return (
                        <td
                          key={`${day.toISOString()}-${mealType}`}
                          className={`p-2 align-top ${
                            isToday(day) ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          <div className="min-h-[80px] space-y-2">
                            {plans.map((plan) => (
                              <button
                                key={plan.id}
                                onClick={() => onPlanClick(plan)}
                                className="w-full text-left p-2 bg-white border border-primary-200 rounded-lg hover:border-primary-400 hover:shadow-sm transition-all group"
                              >
                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-700">
                                  {plan.recipe?.title || 'Unbenannt'}
                                </p>
                                {plan.servings && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {plan.servings} Portionen
                                  </p>
                                )}
                              </button>
                            ))}
                            {!hasPlans && (
                              <button
                                onClick={() => onDateClick(day, mealType)}
                                className="w-full h-full min-h-[80px] flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group"
                              >
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
