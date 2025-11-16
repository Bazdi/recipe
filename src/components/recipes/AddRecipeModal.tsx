import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Clock, Users } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const recipeSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein'),
  description: z.string().min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein'),
  prep_time: z.number().min(1, 'Vorbereitungszeit muss mindestens 1 Minute sein'),
  cook_time: z.number().min(0, 'Kochzeit darf nicht negativ sein'),
  servings: z.number().min(1, 'Mindestens 1 Portion erforderlich'),
  difficulty: z.enum(['Einfach', 'Mittel', 'Schwer']),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, 'Zutatname erforderlich'),
      quantity: z.number().min(0.1),
      unit: z.string().min(1),
    })
  ).min(1, 'Mindestens 1 Zutat erforderlich'),
  instructions: z.array(
    z.object({
      step: z.number(),
      description: z.string().min(1, 'Beschreibung erforderlich'),
    })
  ).min(1, 'Mindestens 1 Anweisung erforderlich'),
  tags: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (recipe: any) => Promise<void>;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      prep_time: 15,
      cook_time: 30,
      servings: 4,
      difficulty: 'Mittel',
      ingredients: [{ name: '', quantity: 1, unit: 'g' }],
      instructions: [{ step: 1, description: '' }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: 'instructions',
  });

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const recipe = {
        ...data,
        user_id: user?.id,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        calories: null,
        nutrition: null,
        image_url: null,
      };

      await onAdd(recipe);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Rezepts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Neues Rezept erstellen" size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Grundinformationen</h3>

          <Input
            label="Rezepttitel"
            placeholder="z.B. Spaghetti Carbonara"
            error={errors.title?.message}
            {...register('title')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              rows={3}
              placeholder="Beschreiben Sie Ihr Rezept..."
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Vorbereitung (Min)"
              type="number"
              leftIcon={<Clock className="w-5 h-5 text-gray-400" />}
              error={errors.prep_time?.message}
              {...register('prep_time', { valueAsNumber: true })}
            />

            <Input
              label="Kochzeit (Min)"
              type="number"
              leftIcon={<Clock className="w-5 h-5 text-gray-400" />}
              error={errors.cook_time?.message}
              {...register('cook_time', { valueAsNumber: true })}
            />

            <Input
              label="Portionen"
              type="number"
              leftIcon={<Users className="w-5 h-5 text-gray-400" />}
              error={errors.servings?.message}
              {...register('servings', { valueAsNumber: true })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schwierigkeit
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                {...register('difficulty')}
              >
                <option value="Einfach">Einfach</option>
                <option value="Mittel">Mittel</option>
                <option value="Schwer">Schwer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Zutaten</h3>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => appendIngredient({ name: '', quantity: 1, unit: 'g' })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Zutat hinzufügen
            </Button>
          </div>

          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Zutat"
                    {...register(`ingredients.${index}.name`)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    type="number"
                    step="0.1"
                    placeholder="Menge"
                    {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <select
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    {...register(`ingredients.${index}.unit`)}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="TL">TL</option>
                    <option value="EL">EL</option>
                    <option value="Stück">Stück</option>
                  </select>
                </div>
              </div>
              {ingredientFields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Anweisungen</h3>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                appendInstruction({ step: instructionFields.length + 1, description: '' })
              }
            >
              <Plus className="w-4 h-4 mr-1" />
              Schritt hinzufügen
            </Button>
          </div>

          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="w-8 h-10 bg-primary-100 text-primary-700 rounded flex items-center justify-center font-semibold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={2}
                  placeholder="Beschreiben Sie diesen Schritt..."
                  {...register(`instructions.${index}.description`)}
                />
              </div>
              {instructionFields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <Input
          label="Tags (kommagetrennt)"
          placeholder="z.B. vegetarisch, schnell, italienisch"
          helperText="Trennen Sie Tags mit Kommas"
          {...register('tags')}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
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
            Rezept erstellen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
