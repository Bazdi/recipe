import React, { useState } from 'react';
import { Plus, Target, AlertCircle, TrendingUp } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { GoalCard, AddGoalModal } from '../components/goals';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';

export const GoalsPage: React.FC = () => {
  const { goals, loading, error, addGoal, updateProgress, deleteGoal } = useGoals();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie dieses Ziel wirklich löschen?')) {
      await deleteGoal(id);
    }
  };

  // Calculate stats
  const completedGoals = goals.filter(
    (g) => (g.current_value / g.target_value) * 100 >= 100
  ).length;
  const averageProgress =
    goals.length > 0
      ? goals.reduce((sum, g) => sum + (g.current_value / g.target_value) * 100, 0) / goals.length
      : 0;

  if (loading) {
    return <Loading fullScreen text="Lade Ziele..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meine Ziele</h1>
          <p className="text-gray-600 mt-2">
            Setzen und verfolgen Sie Ihre Gesundheits- und Ernährungsziele
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Neues Ziel
        </Button>
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
              <Target className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Aktive Ziele</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-600">{completedGoals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="text-2xl">📊</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durchschnitt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageProgress.toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Noch keine Ziele gesetzt. Beginnen Sie damit, Ihre ersten Gesundheitsziele zu definieren!
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Erstes Ziel erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateProgress={updateProgress}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addGoal}
      />
    </div>
  );
};
