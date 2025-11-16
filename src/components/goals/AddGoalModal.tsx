import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Target } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import type { GoalType, GoalPeriod } from '../../types';

const goalTypes: GoalType[] = [
  'Kalorien',
  'Wasser',
  'Protein',
  'Kohlenhydrate',
  'Fett',
  'Schritte',
  'Gewicht',
];

const goalPeriods: GoalPeriod[] = ['Täglich', 'Wöchentlich', 'Monatlich'];

const goalUnits: Record<GoalType, string> = {
  Kalorien: 'kcal',
  Wasser: 'ml',
  Protein: 'g',
  Kohlenhydrate: 'g',
  Fett: 'g',
  Schritte: 'Schritte',
  Gewicht: 'kg',
};

const goalSchema = z.object({
  goal_type: z.string().min(1, 'Zieltyp ist erforderlich'),
  target_value: z.number().min(1, 'Zielwert muss größer als 0 sein'),
  period: z.string().min(1, 'Periode ist erforderlich'),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: any) => Promise<void>;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<GoalType>('Kalorien');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal_type: 'Kalorien',
      target_value: 2000,
      period: 'Täglich',
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const goal = {
        user_id: user?.id,
        goal_type: data.goal_type,
        target_value: data.target_value,
        current_value: 0,
        unit: goalUnits[data.goal_type as GoalType],
        period: data.period,
      };

      await onAdd(goal);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Ziels');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type as GoalType);
    setValue('goal_type', type);

    // Set reasonable defaults
    const defaults: Record<GoalType, number> = {
      Kalorien: 2000,
      Wasser: 2000,
      Protein: 100,
      Kohlenhydrate: 250,
      Fett: 70,
      Schritte: 10000,
      Gewicht: 70,
    };
    setValue('target_value', defaults[type as GoalType]);
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Neues Ziel erstellen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Target className="w-4 h-4 inline mr-2" />
            Zieltyp
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            {...register('goal_type')}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {goalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={`Zielwert (${goalUnits[selectedType]})`}
          type="number"
          step="1"
          placeholder="2000"
          error={errors.target_value?.message}
          {...register('target_value', { valueAsNumber: true })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Periode
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            {...register('period')}
          >
            {goalPeriods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Tipp:</strong> Sie können Ihren Fortschritt jederzeit manuell anpassen.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Ziel erstellen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
