import React, { useState } from 'react';
import { Target, TrendingUp, Trash2, Plus, Minus } from 'lucide-react';
import type { UserGoal } from '../../types';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';

interface GoalCardProps {
  goal: UserGoal;
  onUpdateProgress: (id: string, value: number) => Promise<void>;
  onDelete: (id: string) => void;
}

const goalTypeColors: Record<string, string> = {
  Kalorien: 'text-orange-600',
  Wasser: 'text-blue-600',
  Protein: 'text-red-600',
  Kohlenhydrate: 'text-yellow-600',
  Fett: 'text-purple-600',
  Schritte: 'text-green-600',
  Gewicht: 'text-pink-600',
};

const goalTypeIcons: Record<string, React.ReactNode> = {
  Kalorien: <Target className="w-6 h-6" />,
  Wasser: <Target className="w-6 h-6" />,
  Protein: <Target className="w-6 h-6" />,
  Kohlenhydrate: <Target className="w-6 h-6" />,
  Fett: <Target className="w-6 h-6" />,
  Schritte: <TrendingUp className="w-6 h-6" />,
  Gewicht: <TrendingUp className="w-6 h-6" />,
};

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onUpdateProgress,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const progress = (goal.current_value / goal.target_value) * 100;
  const isComplete = progress >= 100;

  const handleIncrement = async () => {
    setIsUpdating(true);
    try {
      const increment = goal.goal_type === 'Wasser' ? 250 : 100;
      await onUpdateProgress(goal.id, goal.current_value + increment);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (goal.current_value <= 0) return;
    setIsUpdating(true);
    try {
      const decrement = goal.goal_type === 'Wasser' ? 250 : 100;
      await onUpdateProgress(goal.id, Math.max(0, goal.current_value - decrement));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${goalTypeColors[goal.goal_type] || 'text-gray-600'}`}>
              {goalTypeIcons[goal.goal_type] || <Target className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{goal.goal_type}</h3>
              <p className="text-sm text-gray-500">{goal.period}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">
              {goal.current_value.toFixed(0)} / {goal.target_value.toFixed(0)} {goal.unit}
            </span>
            <span className={`font-semibold ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
              {progress.toFixed(0)}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? 'bg-green-500' : 'bg-primary-600'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={handleDecrement}
            disabled={isUpdating || goal.current_value <= 0}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleIncrement}
            disabled={isUpdating}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {isComplete && (
          <div className="mt-3 text-center">
            <span className="text-sm font-medium text-green-600">
              🎉 Ziel erreicht!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
