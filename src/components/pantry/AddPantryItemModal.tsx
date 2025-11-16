import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Calendar, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { PantryCategory } from '../../types';

const pantryCategories: PantryCategory[] = [
  'Gemüse',
  'Obst',
  'Fleisch',
  'Fisch',
  'Milchprodukte',
  'Getreide',
  'Gewürze',
  'Konserven',
  'Tiefkühl',
  'Sonstiges',
];

const pantryItemSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  quantity: z.number().min(0.1, 'Menge muss größer als 0 sein'),
  unit: z.string().min(1, 'Einheit ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  expiry_date: z.string().optional(),
});

type PantryItemFormData = z.infer<typeof pantryItemSchema>;

interface AddPantryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => Promise<void>;
}

export const AddPantryItemModal: React.FC<AddPantryItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PantryItemFormData>({
    resolver: zodResolver(pantryItemSchema),
    defaultValues: {
      quantity: 1,
      unit: 'Stück',
      category: 'Sonstiges',
    },
  });

  const onSubmit = async (data: PantryItemFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const item = {
        ...data,
        expiry_date: data.expiry_date || null,
        photo_url: null,
      };

      await onAdd(item);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Hinzufügen des Artikels');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Neuer Vorratsschrank-Artikel">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="Artikelname"
          placeholder="z.B. Tomaten"
          leftIcon={<Package className="w-5 h-5 text-gray-400" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Menge"
            type="number"
            step="0.1"
            placeholder="1"
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Einheit
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              {...register('unit')}
            >
              <option value="Stück">Stück</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="Packung">Packung</option>
              <option value="Dose">Dose</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-2" />
            Kategorie
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            {...register('category')}
          >
            {pantryCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Ablaufdatum (optional)"
          type="date"
          leftIcon={<Calendar className="w-5 h-5 text-gray-400" />}
          error={errors.expiry_date?.message}
          {...register('expiry_date')}
        />

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
            Hinzufügen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
