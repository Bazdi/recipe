import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const shoppingListSchema = z.object({
  name: z.string().min(3, 'Name muss mindestens 3 Zeichen lang sein'),
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Artikel erforderlich'),
        quantity: z.number().min(0.1),
        unit: z.string().min(1),
      })
    )
    .min(1, 'Mindestens 1 Artikel erforderlich'),
});

type ShoppingListFormData = z.infer<typeof shoppingListSchema>;

interface AddShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (list: any) => Promise<void>;
}

export const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({
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
  } = useForm<ShoppingListFormData>({
    resolver: zodResolver(shoppingListSchema),
    defaultValues: {
      name: '',
      items: [{ name: '', quantity: 1, unit: 'Stück' }],
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: ShoppingListFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const list = {
        user_id: user?.id,
        name: data.name,
        items: data.items.map((item) => ({
          ...item,
          checked: false,
          category: undefined,
        })),
        status: 'Aktiv',
      };

      await onAdd(list);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen der Einkaufsliste');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Neue Einkaufsliste" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="Listenname"
          placeholder="z.B. Wocheneinkauf"
          leftIcon={<ShoppingCart className="w-5 h-5 text-gray-400" />}
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Artikel</h3>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => appendItem({ name: '', quantity: 1, unit: 'Stück' })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Artikel hinzufügen
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {itemFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Artikel"
                      {...register(`items.${index}.name`)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      type="number"
                      step="0.1"
                      placeholder="1"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    <select
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      {...register(`items.${index}.unit`)}
                    >
                      <option value="Stück">Stück</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="Packung">Packung</option>
                    </select>
                  </div>
                </div>
                {itemFields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {errors.items && (
          <p className="text-sm text-red-600">
            {errors.items.message || 'Mindestens ein Artikel erforderlich'}
          </p>
        )}

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
            Liste erstellen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
